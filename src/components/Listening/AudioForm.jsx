'use client';
import { GlobalContainer } from '@/globalStyle';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAddAudio, useDeleteAudioListening, useGetAudioListening } from '@/hooks/listening';

import styled from "styled-components";

export const FormContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 0;
  border-radius: 12px;
  background: #ef4444;           /* red-500 */
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform .04s ease, background .2s ease, box-shadow .2s ease;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.25);

  &:hover {
    background: #dc2626;         /* red-600 */
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(239, 68, 68, 0.32);
  }

  &:active {
    transform: translateY(0);
    background: #b91c1c;         /* red-700 */
    box-shadow: 0 6px 16px rgba(185, 28, 28, 0.28);
  }

  &:focus-visible {
    outline: 3px solid rgba(239, 68, 68, 0.3);
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;



export default function Audioform() {
    const mutation = useAddAudio();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const deleteMutation = useDeleteAudioListening();
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
        setErrorMessage('');
    };


    const sendAudio = async (index) => {
        if (!audios[index]) {
            setErrorMessage(`Audio ${index + 1} not selected! Please choose a file.`);
            return;
        }
        const formData = new FormData();
        formData.append('monthId', id);
        formData.append('inputIndex', index);
        formData.append('audio', audios[index]);

        mutation.mutate(formData, {
            onSuccess: () => {
                refetch();
                setErrorMessage('Audio uploaded successfully!');
                setTimeout(() => setErrorMessage(''), 3000);
            },
            onError: () => setErrorMessage('An error occurred while uploading audio.'),
        });
    };


    const handleDelete = () => {
        deleteMutation.mutate(id)
    }

    return (
        <div >
            <GlobalContainer>
                <FormContainer>
                    <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>🎧 Upload Listening Audio</h2>
                    {errorMessage && (
                        <div
                            style={{
                                textAlign: 'center',
                                color: errorMessage.includes('successfully') ? '#27ae60' : '#e74c3c',
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
                                        Send Audio {i + 1}
                                    </button>
                                </div>

                                <div style={{ margin: '5px 0', fontWeight: 500, color: '#2c3e50' }}>
                                    Selected audio: {data && data[i]?.originalname}
                                </div>
                                {data?.[i] && (
                                    <audio controls style={{ width: '100%', marginTop: '10px' }}>
                                        <source
                                            src={`${baseUrl}/uploads/audio/${data[i].filename}`}
                                            type={data[i].mimetype}
                                        />
                                        Your browser does not support audio playback.
                                    </audio>
                                )}
                            </div>
                        ))}

                    </FormWrapper>
                    <DangerButton onClick={handleDelete}>🗑️ Delete all songs</DangerButton>

                </FormContainer>

            </GlobalContainer>
        </div>
    );
}
