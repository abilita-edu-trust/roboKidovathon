import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceNoteRecorderProps {
  onAudioReady: (file: File | null) => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const file = new File([audioBlob], `voicenote_${Date.now()}.webm`, { type: 'audio/webm' });
        onAudioReady(file);

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMsg('Microphone access denied or not available. You can upload an audio file instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    onAudioReady(null);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onAudioReady(file);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-headline font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#006AA7]" />
          Record Voice Note (Idea Audio Description)
        </span>
        <span className="text-[11px] font-mono-code text-slate-500">
          Max 3 minutes
        </span>
      </div>

      {errorMsg && (
        <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!audioUrl ? (
        <div className="flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="py-2.5 px-4 bg-[#006AA7] hover:bg-[#013A63] text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Mic className="w-4 h-4 text-[#FFCD00]" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-headline font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse shadow-sm"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Recording ({formatSeconds(recordingTime)})</span>
            </button>
          )}

          <div className="text-xs text-slate-400 font-mono-code">or</div>

          <label className="py-2.5 px-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-headline font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload Audio File</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 p-3 bg-white border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow"
              aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <div className="text-xs font-headline font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Voice Note Ready ({formatSeconds(recordingTime || 12)})</span>
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                Ready for submission with your idea
              </div>
            </div>
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={resetRecording}
            className="text-xs text-slate-500 hover:text-red-600 font-mono-code flex items-center gap-1 p-1"
            title="Re-record voice note"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-record</span>
          </button>
        </div>
      )}
    </div>
  );
};
