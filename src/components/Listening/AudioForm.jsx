'use client';
import { GlobalContainer } from '@/globalStyle';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAddAudio, useGetAudioListening } from '@/hooks/listening';

import styled from "styled-components";

export const FormContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
`;

export const FormWrapper = styled.div`
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

export const AudioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px auto 50px;
  padding: 0 20px;
`;

export const AudioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #f1f5f9, #e0e7ff);
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const DeleteBtn = styled.button`
  background: #ff4d4f;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  transition:  0.3s ease, transform 0.2s ease;

  &:hover {
    background: #d9363e;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;



export default function Audioform() {
    const mutation = useAddAudio();
    // const deleteMutation = useDeleteAudioListening(); // Comment qilingan, kerak bo'lsa faollashtirish mumkin
    const { id } = useParams();
    const [audios, setAudios] = useState([null, null, null, null]);
    const [errorMessage, setErrorMessage] = useState('');

    const { data, isLoading, error, refetch } = useGetAudioListening({
        monthId: id,
    });

    const handleAudioChange = (index, file) => {
        const newAudios = [...audios];
        newAudios[index] = file;
        setAudios(newAudios);
        setErrorMessage(''); // Xatolik xabarini tozalash
    };


    const sendAudio = async (index) => {
        if (!audios[index]) {
            setErrorMessage(`${index + 1}-audio tanlanmagan! Iltimos, fayl tanlang.`);
            return;
        }
        const formData = new FormData();
        formData.append('monthId', id);
        formData.append('inputIndex', index); // <<< inputIndex qo‘shildi
        formData.append('audio', audios[index]);

        mutation.mutate(formData, {
            onSuccess: () => {
                refetch();
                setErrorMessage('Audio muvaffaqiyatli yuklandi!');
                setTimeout(() => setErrorMessage(''), 3000); // 3 soniya keyin xabar o‘chadi
            },
            onError: () => setErrorMessage('Audio yuklashda xatolik yuz berdi.'),
        });
    };


    const handleDelete = (audioId) => {
        // if (window.confirm("Rostdan ham o‘chirmoqchimisiz?")) {
        //   deleteMutation.mutate({ id: audioId }, {
        //     onSuccess: () => refetch()
        //   })
        // }
    };
    console.log('data', data);

    return (
        <div >
            <GlobalContainer>
                <FormContainer>
                    <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>🎧 Listening Audio Yuklash</h2>
                    {errorMessage && (
                        <div
                            style={{
                                textAlign: 'center',
                                color: errorMessage.includes('muvaffaqiyat') ? '#27ae60' : '#e74c3c',
                                marginBottom: '15px',
                                fontWeight: 500,
                            }}
                        >
                            {errorMessage}
                        </div>
                    )}
                    <FormWrapper>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{ width: '100%', marginBottom: '15px' }}>
                                {/* Fayl nomini ko'rsatish */}
                             

                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => handleAudioChange(i, e.target.files[0])}
                                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => sendAudio(i)}
                                        style={{
                                            padding: '8px 16px',
                                            background: '#3498db',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s',
                                        }}
                                        onMouseOver={(e) => (e.target.style.background = '#2980b9')}
                                        onMouseOut={(e) => (e.target.style.background = '#3498db')}
                                    >
                                        {i + 1}-Audio Jo‘natish
                                    </button>
                                </div>

                                <div style={{ marginBottom: '5px', fontWeight: 500, color: '#2c3e50' }}>
                                    {/* Tanlangan audio: {data[i]?.originalname} */}
                                </div>
                                {data?.[i] && (

                                    <audio controls style={{ width: '100%', marginTop: '10px' }}>
                                        <source
                                            src={`http://localhost:5000/uploads/audio/${data[i].filename}`}
                                            type={data[i].mimetype}
                                        />
                                        Brauzeringiz audio o‘ynashni qo‘llab-quvvatlamaydi.
                                    </audio>
                                )}
                            </div>
                        ))}

                    </FormWrapper>
                </FormContainer>

            </GlobalContainer>
        </div>
    );
}