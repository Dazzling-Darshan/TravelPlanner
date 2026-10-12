import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Users, MessageSquare, Image as ImageIcon, Smile, X, Paperclip, Loader2 } from 'lucide-react';
import api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';

const GroupChat = ({ destination, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [buddies, setBuddies] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const intervalRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const { data } = await api.get(`/chat/${encodeURIComponent(destination)}`);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load chat", error);
        }
    };

    const fetchBuddies = async () => {
        try {
            const { data } = await api.get(`/chat/${encodeURIComponent(destination)}/buddies`);
            setBuddies(data);
        } catch (error) {
            console.error("Failed to load buddies", error);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchBuddies();
        intervalRef.current = setInterval(fetchMessages, 3000);
        return () => clearInterval(intervalRef.current);
    }, [destination]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !selectedImage) return;

        setUploading(true);
        try {
            await api.post(`/chat/${encodeURIComponent(destination)}`, {
                message: newMessage,
                senderName: user.username,
                type: selectedImage ? 'image' : 'text',
                imageUrl: selectedImage
            });
            setNewMessage('');
            setSelectedImage(null);
            setShowPicker(false);
            fetchMessages();
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setUploading(false);
        }
    };

    const onEmojiClick = (emojiObject) => {
        setNewMessage(prev => prev + emojiObject.emoji);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
            <div className="bg-[#0a0a0a] w-full lg:max-w-6xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/10">

                {/* Sidebar - Buddies List (Desktop) */}
                <div className="hidden md:flex flex-col w-72 bg-[#050505] border-r border-white/5">
                    <div className="p-6 border-b border-white/5 bg-[#0a0a0a]">
                        <h3 className="font-urbanist font-bold text-lg flex items-center gap-2 text-white uppercase tracking-wider">
                            <Users className="w-5 h-5 text-emerald-500" /> Trip Buddies
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{buddies.length} Active Nodes</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {buddies.map((buddy, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black font-black shadow-md group-hover:scale-110 transition-transform">
                                    {buddy.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-urbanist font-bold text-white truncate text-[14px]">{buddy.username}</p>
                                    <p className="text-[10px] text-gray-500 truncate uppercase tracking-tighter">{buddy.email}</p>
                                </div>
                                {user.username === buddy.username && (
                                    <span className="ml-auto text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-widest">You</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-[#050505] relative h-full">
                    {/* Header */}
                    <div className="bg-[#0a0a0a] p-4 px-6 border-b border-white/5 flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-4">
                            <button onClick={onClose} className="md:hidden p-2 hover:bg-white/5 rounded-full">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                            <div>
                                <h3 className="font-urbanist font-bold text-xl text-white flex items-center gap-2 tracking-tight">
                                    {destination}
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Encrypted</span>
                                </h3>
                                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5 uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Frequency Active
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hidden md:flex p-2 hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                        {loading ? (
                            <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-white opacity-20" /></div>
                        ) : messages.length === 0 ? (
                            <div className="text-center mt-20">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-40 animate-pulse">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-urbanist font-bold text-white text-lg tracking-tight uppercase">Terminal Offline</h4>
                                <p className="text-gray-500 text-sm mt-1">Initialize communication with the crew.</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = msg.senderId === user.id;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2`}>
                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                            {!isMe && (
                                                <span className="text-[10px] text-gray-500 ml-2 mb-1 font-bold uppercase tracking-widest">{msg.senderName}</span>
                                            )}

                                            <div className={`p-4 shadow-2xl relative ${isMe
                                                ? (msg.type === 'image' ? 'bg-white p-1 rounded-2xl' : 'bg-white text-black rounded-[20px] rounded-tr-sm')
                                                : (msg.type === 'image' ? 'bg-[#0a0a0a] p-1 rounded-2xl border border-white/10' : 'bg-[#0a0a0a] text-white border border-white/10 rounded-[20px] rounded-tl-sm')
                                                }`}>
                                                {msg.type === 'image' ? (
                                                    <img src={msg.imageUrl} alt="Shared" className="rounded-[14px] max-h-72 object-cover cursor-pointer hover:scale-[1.01] transition-transform" />
                                                ) : (
                                                    <p className="text-[15px] leading-relaxed font-inter">{msg.message}</p>
                                                )}

                                                <span className={`text-[9px] block mt-2 text-right font-bold uppercase tracking-tighter ${isMe ? 'text-black/40' : 'text-gray-600'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="px-6 py-3 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between animate-in slide-in-from-bottom-full duration-300">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <img src={selectedImage} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-white/10" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                        <ImageIcon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white uppercase tracking-wider">Payload Ready</span>
                                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">Image File Buffer</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedImage(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 sm:p-6 bg-[#0a0a0a] border-t border-white/10 backdrop-blur-xl">
                        <form onSubmit={handleSend} className="flex gap-4 items-end max-w-5xl mx-auto">

                            {/* Tools */}
                            <div className="flex gap-2 pb-1.5">
                                <button type="button" onClick={() => setShowPicker(!showPicker)} className={`p-2.5 rounded-full transition-all relative ${showPicker ? 'bg-emerald-500/10 text-emerald-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                                    <Smile className="w-6 h-6" />
                                    {showPicker && (
                                        <div className="absolute bottom-16 left-[-16px] sm:left-0 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 overflow-hidden">
                                            <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} width={window.innerWidth < 640 ? 280 : 320} height={400} />
                                        </div>
                                    )}
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                    <ImageIcon className="w-6 h-6" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />
                            </div>

                            {/* Text Input */}
                            <div className="flex-1 bg-black border border-white/10 rounded-[18px] px-5 py-3 focus-within:border-white/30 transition-all">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onFocus={() => setShowPicker(false)}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={selectedImage ? "Encrypt a caption..." : "Write a signal..."}
                                    className="w-full bg-transparent outline-hidden text-white placeholder-gray-600 font-inter text-[15px] min-h-[22px]"
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && !selectedImage) || uploading}
                                className={`p-3.5 rounded-[16px] shadow-2xl transform transition-all hover:scale-105 active:scale-95 ${(!newMessage.trim() && !selectedImage)
                                    ? 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                                    : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupChat;
