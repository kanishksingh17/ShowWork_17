// Video Recorder Component - Browser camera recording

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Play,
  Pause,
  Square,
  Download,
  Trash2,
  Camera,
  CameraOff,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onRecordingComplete: (file: File) => void;
  onError?: (error: string) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  blob: Blob | null;
  url: string | null;
}

export default function VideoRecorder({
  onRecordingComplete,
  onError,
  maxDuration = 300, // 5 minutes default
  className,
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    blob: null,
    url: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [settings, setSettings] = useState({
    resolution: "1280x720",
    frameRate: 30,
    audio: true,
  });

  // Get available video devices
  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      setAvailableDevices(videoDevices);

      if (videoDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error getting video devices:", err);
    }
  }, [selectedDevice]);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { ideal: parseInt(settings.resolution.split("x")[0]) },
          height: { ideal: parseInt(settings.resolution.split("x")[1]) },
          frameRate: { ideal: settings.frameRate },
        },
        audio: settings.audio,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setHasPermission(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access camera";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDevice, settings, onError]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        setRecordingState((prev) => ({
          ...prev,
          blob,
          url,
        }));
      };

      mediaRecorder.start(1000); // Collect data every second

      setRecordingState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
      }));

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingState((prev) => {
          const newDuration = prev.duration + 1;

          if (newDuration >= maxDuration) {
            stopRecording();
            return prev;
          }

          return { ...prev, duration: newDuration };
        });
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start recording";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [maxDuration, onError]);

  // Pause/Resume recording
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (recordingState.isPaused) {
      mediaRecorderRef.current.resume();
      setRecordingState((prev) => ({ ...prev, isPaused: false }));
    } else {
      mediaRecorderRef.current.pause();
      setRecordingState((prev) => ({ ...prev, isPaused: true }));
    }
  }, [recordingState.isPaused]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRecordingState((prev) => ({
      ...prev,
      isRecording: false,
      isPaused: false,
    }));
  }, [recordingState.isRecording]);

  // Save recording
  const saveRecording = useCallback(() => {
    if (recordingState.blob) {
      const file = new File(
        [recordingState.blob],
        `recording-${Date.now()}.webm`,
        {
          type: "video/webm",
        },
      );
      onRecordingComplete(file);
    }
  }, [recordingState.blob, onRecordingComplete]);

  // Delete recording
  const deleteRecording = useCallback(() => {
    if (recordingState.url) {
      URL.revokeObjectURL(recordingState.url);
    }

    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      blob: null,
      url: null,
    });
  }, [recordingState.url]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingState.url) {
        URL.revokeObjectURL(recordingState.url);
      }
    };
  }, [recordingState.url]);

  // Initialize on mount
  useEffect(() => {
    getVideoDevices();
  }, [getVideoDevices]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = (recordingState.duration / maxDuration) * 100;

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Video Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Camera Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {!hasPermission ? (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <CameraOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Camera not initialized</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          )}

          {/* Recording Overlay */}
          {recordingState.isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <Badge variant="destructive" className="text-xs">
                {formatDuration(recordingState.duration)}
              </Badge>
            </div>
          )}

          {/* Progress Bar */}
          {recordingState.isRecording && (
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <Progress value={progressPercentage} className="h-1" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!hasPermission ? (
            <Button
              onClick={initializeCamera}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Start Camera
                </>
              )}
            </Button>
          ) : (
            <>
              {!recordingState.isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={!hasPermission}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <Video className="w-4 h-4" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button
                    onClick={togglePause}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {recordingState.isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    {recordingState.isPaused ? "Resume" : "Pause"}
                  </Button>

                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Recording Preview */}
        {recordingState.url && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium mb-2">Recording Preview:</p>
              <video
                src={recordingState.url}
                controls
                className="w-full rounded-md"
                style={{ maxHeight: "200px" }}
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={saveRecording}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save Recording
              </Button>

              <Button
                onClick={deleteRecording}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="border-t pt-4">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <Settings className="w-4 h-4" />
              Recording Settings
            </summary>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <label className="block mb-1">Resolution:</label>
                <select
                  value={settings.resolution}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      resolution: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="640x480">640x480</option>
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Frame Rate:</label>
                <select
                  value={settings.frameRate}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      frameRate: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value={15}>15 fps</option>
                  <option value={30}>30 fps</option>
                  <option value={60}>60 fps</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.audio}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        audio: e.target.checked,
                      }))
                    }
                  />
                  Include Audio
                </label>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
