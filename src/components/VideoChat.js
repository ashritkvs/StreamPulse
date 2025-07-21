import React, { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const peerRef = useRef(null);
  const [isCaller, setIsCaller] = useState(false);

  useEffect(() => {
    const loadModelAndStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.onloadedmetadata = () => {
        localVideoRef.current.play();
      };

      // Prompt to decide caller or receiver
      const role = window.confirm('Click OK if you are the caller. Cancel if receiver.');
      setIsCaller(role);

      if (role) {
        // Only run detection on the caller side
        const model = await cocoSsd.load();
        detectFrame(localVideoRef.current, model);
      }

      setupPeer(role, stream);
    };

    const detectFrame = (video, model) => {
      if (!video || video.videoWidth === 0) return;
      model.detect(video).then((predictions) => {
        renderPredictions(predictions);
        requestAnimationFrame(() => detectFrame(video, model));
      });
    };

    const renderPredictions = (predictions) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      predictions.forEach((pred) => {
        const [x, y, width, height] = pred.bbox;
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'lime';
        ctx.fillText(pred.class, x, y > 10 ? y - 5 : 10);
      });
    };

    const setupPeer = async (isCaller, stream) => {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      peerRef.current = peer;

      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play();
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
        }
      };

      if (isCaller) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit('offer', offer);
      }

      socket.on('offer', async (offer) => {
        if (!isCaller) {
          await peer.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket.emit('answer', answer);
        }
      });

      socket.on('answer', async (answer) => {
        if (isCaller) {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on('ice-candidate', async (candidate) => {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      });
    };

    loadModelAndStream();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>📹 StreamPulse</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <div style={{ position: 'relative' }}>
          <video ref={localVideoRef} width="320" height="240" muted style={{ position: 'absolute' }} />
          <canvas ref={canvasRef} width="320" height="240" style={{ position: 'absolute' }} />
          <p style={{ textAlign: 'center' }}>You</p>
        </div>
        <div>
          <video ref={remoteVideoRef} width="320" height="240" autoPlay />
          <p style={{ textAlign: 'center' }}>Peer</p>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
