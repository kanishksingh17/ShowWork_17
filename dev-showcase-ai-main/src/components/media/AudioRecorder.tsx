// Audio Recorder Component - Microphone recording with waveform

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Download,
  Trash2,
  Volume2,
  VolumeX,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
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

interface WaveformData {
  data: number[];
  maxValue: number;
}

export default function AudioRecorder({
  onRecordingComplete,
  onError,
  maxDuration = 300, // 5 minutes default
  className,
}: AudioRecorderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
  const [waveformData, setWaveformData] = useState<WaveformData>({
    data: [],
    maxValue: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState({
    sampleRate: 44100,
    audio: true,
    noiseReduction: true,
  });

  // Audio context for waveform analysis
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize microphone
  const initializeMicrophone = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: settings.sampleRate,
          echoCancellation: settings.noiseReduction,
          noiseSuppression: settings.noiseReduction,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Set up audio context for waveform analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Start waveform visualization
      const drawWaveform = () => {
        if (!analyserRef.current || !recordingState.isRecording) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Convert to normalized values
        const normalizedData = Array.from(dataArray).map(
          (value) => value / 255,
        );
        const maxValue = Math.max(...normalizedData);

        setWaveformData({
          data: normalizedData,
          maxValue,
        });

        if (recordingState.isRecording) {
          animationFrameRef.current = requestAnimationFrame(drawWaveform);
        }
      };

      if (recordingState.isRecording) {
        drawWaveform();
      }

      setHasPermission(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access microphone";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [settings, recordingState.isRecording, onError]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
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

      // Start waveform visualization
      if (audioContextRef.current && analyserRef.current) {
        const drawWaveform = () => {
          if (!analyserRef.current || !recordingState.isRecording) return;

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          const normalizedData = Array.from(dataArray).map(
            (value) => value / 255,
          );
          const maxValue = Math.max(...normalizedData);

          setWaveformData({
            data: normalizedData,
            maxValue,
          });

          if (recordingState.isRecording) {
            animationFrameRef.current = requestAnimationFrame(drawWaveform);
          }
        };

        drawWaveform();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start recording";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [maxDuration, onError, recordingState.isRecording]);

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

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setRecordingState((prev) => ({
      ...prev,
      isRecording: false,
      isPaused: false,
    }));
  }, [recordingState.isRecording]);

  // Play/Pause audio
  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !recordingState.url) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, recordingState.url]);

  // Save recording
  const saveRecording = useCallback(() => {
    if (recordingState.blob) {
      const file = new File(
        [recordingState.blob],
        `recording-${Date.now()}.webm`,
        {
          type: "audio/webm",
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

  // Draw waveform on canvas
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || waveformData.data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / waveformData.data.length;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#3b82f6";

    waveformData.data.forEach((value, index) => {
      const barHeight = (value / waveformData.maxValue) * height;
      const x = index * barWidth;
      const y = height - barHeight;

      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [waveformData]);

  // Update canvas when waveform data changes
  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (recordingState.url) {
        URL.revokeObjectURL(recordingState.url);
      }
    };
  }, [recordingState.url]);

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
          <Mic className="w-5 h-5" />
          Audio Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Waveform Display */}
        <div className="relative bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {recordingState.isRecording ? (
                <Volume2 className="w-4 h-4 text-blue-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm font-medium">Audio Level</span>
            </div>

            {recordingState.isRecording && (
              <Badge variant="destructive" className="text-xs">
                {formatDuration(recordingState.duration)}
              </Badge>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={100}
            className="w-full h-24 border rounded-md bg-white"
          />

          {/* Progress Bar */}
          {recordingState.isRecording && (
            <div className="mt-2">
              <Progress value={progressPercentage} className="h-1" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!hasPermission ? (
            <Button
              onClick={initializeMicrophone}
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
                  <Mic className="w-4 h-4" />
                  Start Microphone
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
                  <Mic className="w-4 h-4" />
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
              <audio
                ref={audioRef}
                src={recordingState.url}
                controls
                className="w-full"
                onEnded={() => setIsPlaying(false)}
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
                <label className="block mb-1">Sample Rate:</label>
                <select
                  value={settings.sampleRate}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      sampleRate: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value={22050}>22.05 kHz</option>
                  <option value={44100}>44.1 kHz</option>
                  <option value={48000}>48 kHz</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.noiseReduction}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        noiseReduction: e.target.checked,
                      }))
                    }
                  />
                  Noise Reduction
                </label>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
