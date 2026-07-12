import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2, MessageSquare, PenTool, Eraser, Minus, Circle, Square,
  X, Send, Users, Wifi, WifiOff, PhoneOff
} from 'lucide-react';
import { useLiveClass, useLiveClassMessages, useSendLiveClassMessage, useEndLiveClass } from '@/hooks/useLiveClass';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/tutor/live-sessions/$sessionId')({
  component: LiveSessionPage,
});

type DrawingTool = 'pen' | 'eraser' | 'line' | 'circle' | 'rect';

function LiveSessionPage() {
  const { sessionId } = Route.useParams();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard'>('video');
  const [chatInput, setChatInput] = useState('');
  const [lastMsgTime, setLastMsgTime] = useState<string | undefined>(undefined);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Whiteboard state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [color, setColor] = useState('#1a1a2e');
  const [lineWidth, setLineWidth] = useState(3);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const { data: session, isLoading } = useLiveClass(sessionId);
  const { data: messages } = useLiveClassMessages(sessionId, lastMsgTime);
  const sendMsgMutation = useSendLiveClassMessage(sessionId);
  const endClassMutation = useEndLiveClass();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages?.length) {
      setLastMsgTime(messages[messages.length - 1].createdAt);
    }
  }, [messages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMsgMutation.mutate(chatInput.trim());
    setChatInput('');
  };

  // ─── Whiteboard Drawing ───────────────────────────────────
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);

    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { setIsDrawing(false); lastPos.current = null; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const jitsiRoom = session?.meetingUrl || `leadlearnhub-${sessionId}`;
  const jitsiUrl = `https://meet.jit.si/${jitsiRoom}#userInfo.displayName="${encodeURIComponent(user ? `${user.firstName} ${user.lastName}` : 'User')}"&config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.prejoinPageEnabled=false&interfaceConfig.SHOW_JITSI_WATERMARK=false`;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden bg-gray-900">
      {/* ─── Top Bar ──────────────────────── */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between border-b border-gray-700 shrink-0">
        <div>
          <h1 className="font-bold text-lg">{session?.title || 'Live Class'}</h1>
          <p className="text-xs text-gray-400">{session?.course?.title}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`flex items-center gap-1.5 text-xs font-semibold ${session?.isLive ? 'text-red-400' : 'text-gray-400'}`}>
            {session?.isLive ? <><Wifi className="h-3.5 w-3.5" /> LIVE</> : <><WifiOff className="h-3.5 w-3.5" /> OFFLINE</>}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'video' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >📹 Video</button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'whiteboard' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >🎨 Whiteboard</button>
          </div>
          {user?.role === 'TUTOR' && session?.isLive && (
            <button
              onClick={() => endClassMutation.mutate(sessionId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <PhoneOff className="h-3.5 w-3.5" /> End Class
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Content ──────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video or Whiteboard */}
        <div className="flex-1 overflow-hidden relative bg-gray-800">
          {activeTab === 'video' ? (
            <iframe
              src={jitsiUrl}
              allow="camera; microphone; display-capture; autoplay; clipboard-write"
              allowFullScreen
              className="w-full h-full border-0"
              title="Jitsi Meet"
            />
          ) : (
            <div className="h-full flex flex-col bg-white">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-border shrink-0 flex-wrap">
                {([
                  { id: 'pen', icon: '✏️', label: 'Pen' },
                  { id: 'eraser', icon: '🧹', label: 'Eraser' },
                ] as const).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tool === t.id ? 'bg-primary text-white' : 'bg-white border border-border hover:bg-secondary'}`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border border-border" title="Color" />
                <input type="range" min={1} max={20} value={lineWidth} onChange={e => setLineWidth(Number(e.target.value))} className="w-24" />
                <span className="text-xs text-muted-foreground">{lineWidth}px</span>
                <button onClick={clearCanvas} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
                  Clear
                </button>
              </div>
              {/* Canvas */}
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="flex-1 w-full cursor-crosshair touch-none"
                style={{ background: '#fff', display: 'block' }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
          )}
        </div>

        {/* Right: Live Chat */}
        <div className="w-72 bg-gray-900 border-l border-gray-700 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-white">Live Chat</span>
            <span className="ml-auto text-xs text-gray-500">{messages?.length || 0} messages</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-gray-500">No messages yet.<br />Be the first to say something!</p>
              </div>
            ) : messages?.map((msg: any) => {
              const isMine = msg.user.id === user?.id;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                  <div className="h-7 w-7 rounded-full bg-primary grid place-items-center text-white text-xs font-bold shrink-0">
                    {msg.user.firstName[0]}
                  </div>
                  <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isMine && <p className="text-[10px] text-gray-400 mb-0.5">{msg.user.firstName}</p>}
                    <div className={`px-3 py-2 rounded-2xl text-xs ${isMine ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-700 text-gray-100 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                    <p className="text-[9px] text-gray-600 mt-0.5">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-gray-700 flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Say something…"
              className="flex-1 px-3 py-2 rounded-xl bg-gray-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary border-0"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || sendMsgMutation.isPending}
              className="h-8 w-8 rounded-xl bg-primary grid place-items-center text-white disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
