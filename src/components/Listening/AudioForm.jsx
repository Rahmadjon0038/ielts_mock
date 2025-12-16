"use client";
import { GlobalContainer } from "@/globalStyle";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useAddAudio,
  useDeleteAudioListening,
  useGetAudioListening,
} from "@/hooks/listening";
import MiniLoader from "../MiniLoader/MiniLoader";

import styled from "styled-components";

export const FormContainer = styled.div`
  padding: 15px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 8px;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-top: 10px;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 12px;
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
  transition: 0.3s ease, transform 0.2s ease;

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
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 0;
  border-radius: 10px;
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
  transition: transform 0.04s ease, background 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25);

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    max-width: 100%;
  }

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.32);
  }

  &:active {
    transform: translateY(0);
    background: #b91c1c;
    box-shadow: 0 4px 12px rgba(185, 28, 28, 0.28);
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

export const UploadBtn = styled.button`
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.4);

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 12px;
    flex: 0 0 auto;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 16px rgba(102, 126, 234, 0.6);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
`;

export const FileInput = styled.input`
  padding: 6px 8px;
  border-radius: 6px;
  border: 2px solid #ddd;
  transition: all 0.2s ease;
  font-size: 13px;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 6px;
    font-size: 12px;
  }

  &:hover:not(:disabled) {
    border-color: #3498db;
  }

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &:disabled {
    background-color: #ecf0f1;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default function Audioform() {
  const mutation = useAddAudio();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const deleteMutation = useDeleteAudioListening();
  const { id } = useParams();
  const [audios, setAudios] = useState([null, null, null, null]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading, error, refetch } = useGetAudioListening({
    monthId: id,
  });

  // URL to'g'rilash funksiyasi - ikki marta slash bo'lmasligi uchun
  const getAudioUrl = (filename) => {
    if (!filename || !baseUrl) return "";
    // baseUrl oxirida slash bo'lsa, uni olib tashlaymiz
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}/uploads/audio/${filename}`;
  };

  // Audio formatini to'g'rilash funksiyasi
  const getAudioMimeType = (mimetype) => {
    if (!mimetype) return "audio/mpeg";

    // m4a fayllar uchun to'g'ri mimetype
    if (mimetype.includes("m4a") || mimetype.includes("x-m4a")) {
      return "audio/mp4";
    }

    // Boshqa formatlar
    const mimeMap = {
      "audio/x-m4a": "audio/mp4",
      "audio/m4a": "audio/mp4",
      "audio/mpeg": "audio/mpeg",
      "audio/mp3": "audio/mpeg",
      "audio/wav": "audio/wav",
      "audio/ogg": "audio/ogg",
    };

    return mimeMap[mimetype] || "audio/mpeg";
  };

  const handleAudioChange = (index, file) => {
    const newAudios = [...audios];
    newAudios[index] = file;
    setAudios(newAudios);
    setErrorMessage("");
  };

  const sendAudio = async (index) => {
    const fileToSend = audios[index];
    if (!fileToSend) {
      setErrorMessage(`Audio ${index + 1} ni tanlang!`);
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setLoadingIndex(index);
    const formData = new FormData();
    formData.append("monthId", id);
    formData.append("inputIndex", index);
    formData.append("audio", fileToSend);

    mutation.mutate(formData, {
      onSuccess: () => {
        refetch();
        setErrorMessage("✅ Audio muvaffaqiyatli yuklandi!");
        // Yuklangan faylni tozalaymiz
        setAudios((prev) => {
          const copy = [...prev];
          copy[index] = null;
          return copy;
        });
        setLoadingIndex(null);
        setTimeout(() => setErrorMessage(""), 3000);
      },
      onError: () => {
        setErrorMessage("❌ Audioni yuklashda xatolik yuz berdi.");
        setLoadingIndex(null);
        setTimeout(() => setErrorMessage(""), 3000);
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Barcha audiolarni o'chirishni tasdiqlaysizmi?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setErrorMessage("✅ Barcha audiolar o'chirildi!");
          refetch();
          setTimeout(() => setErrorMessage(""), 3000);
        },
        onError: () => {
          setErrorMessage("❌ O'chirishda xatolik yuz berdi.");
          setTimeout(() => setErrorMessage(""), 3000);
        },
      });
    }
  };

  return (
    <div>
      <GlobalContainer>
        <FormContainer>
          <h2
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "clamp(20px, 5vw, 26px)",
              marginBottom: "10px",
            }}
          >
            🎧 Listening Audio Yuklash
          </h2>

          {/* Eslatma */}
          <div
            style={{
              background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
              padding: "clamp(10px, 3vw, 15px) clamp(12px, 4vw, 20px)",
              borderRadius: "10px",
              marginBottom: "15px",
              border: "2px solid #f39c12",
              boxShadow: "0 3px 10px rgba(243, 156, 18, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "clamp(18px, 4vw, 22px)" }}>⚠️</span>
              <h3
                style={{
                  margin: 0,
                  color: "#d35400",
                  fontSize: "clamp(15px, 3.5vw, 17px)",
                  fontWeight: 700,
                }}
              >
                Muhim eslatma!
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                color: "#8e44ad",
                fontSize: "clamp(12px, 2.8vw, 14px)",
                fontWeight: 600,
                lineHeight: "1.5",
              }}
            >
              Iltimos, audio fayllarni <strong>birin-ketin</strong> yuklang.
              Birinchi audio yuklash tugagandan so'ng, ikkinchisini yuklashingiz
              mumkin. Bu jarayon audio fayllarning to'g'ri tartibda saqlanishini
              ta'minlaydi.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                textAlign: "center",
                color: errorMessage.includes("✅") ? "#27ae60" : "#e74c3c",
                marginBottom: "15px",
                fontWeight: 600,
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "clamp(12px, 2.5vw, 14px)",
                backgroundColor: errorMessage.includes("✅")
                  ? "#d5f4e6"
                  : "#fadbd8",
                border: `2px solid ${
                  errorMessage.includes("✅") ? "#27ae60" : "#e74c3c"
                }`,
                animation: "slideIn 0.3s ease",
              }}
            >
              {errorMessage}
            </div>
          )}

          <FormWrapper>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "100%",
                  marginBottom: "15px",
                  padding: "clamp(12px, 3vw, 18px)",
                  background:
                    data?.[i] || audios[i]
                      ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                      : "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                  borderRadius: "10px",
                  border: `2px solid ${
                    loadingIndex === i
                      ? "#667eea"
                      : data?.[i]
                      ? "#27ae60"
                      : "#e0e0e0"
                  }`,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "10px",
                    color: "#2c3e50",
                    fontSize: "clamp(14px, 3vw, 16px)",
                  }}
                >
                  Audio {i + 1}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <FileInput
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioChange(i, e.target.files[0])}
                    disabled={loadingIndex !== null}
                  />
                  <UploadBtn
                    type="button"
                    onClick={() => sendAudio(i)}
                    disabled={
                      loadingIndex !== null || !audios[i] || !!data?.[i]
                    }
                  >
                    {loadingIndex === i ? (
                      <>
                        <MiniLoader /> Yuklanmoqda...
                      </>
                    ) : (
                      `📤 Yuklash`
                    )}
                  </UploadBtn>
                </div>

                <div
                  style={{
                    margin: "8px 0",
                    fontWeight: 500,
                    color: "#34495e",
                    fontSize: "clamp(12px, 2.5vw, 13px)",
                  }}
                >
                  📁 Fayl:{" "}
                  <span style={{ color: "#667eea", fontWeight: 600 }}>
                    {data?.[i]?.originalname ||
                      audios[i]?.name ||
                      "Hali tanlanmagan"}
                  </span>
                </div>

                {data?.[i] && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "clamp(10px, 2.5vw, 12px)",
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div style={{ marginBottom: "8px" }}>
                      <a
                        href={getAudioUrl(data[i].filename)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#667eea",
                          textDecoration: "none",
                          fontSize: "clamp(11px, 2.3vw, 12px)",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        🔗 Audioni yangi tabda ochish
                      </a>
                    </div>
                    <audio
                      key={data[i].filename}
                      controls
                      controlsList="nodownload"
                      style={{ width: "100%", outline: "none" }}
                      preload="auto"
                      onError={(e) => {
                        console.error("❌ Audio yuklashda xatolik:", {
                          filename: data[i].filename,
                          url: getAudioUrl(data[i].filename),
                          mimetype: data[i].mimetype,
                          error: e.currentTarget.error,
                        });
                      }}
                      onLoadedData={() => {
                        console.log("✅ Audio yuklandi:", data[i].filename);
                      }}
                    >
                      <source
                        src={getAudioUrl(data[i].filename)}
                        type={getAudioMimeType(data[i].mimetype)}
                      />
                      <source
                        src={getAudioUrl(data[i].filename)}
                        type="audio/mpeg"
                      />
                      <source
                        src={getAudioUrl(data[i].filename)}
                        type="audio/mp4"
                      />
                      Brauzer audio formatini qo'llab-quvvatlamaydi.
                    </audio>
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "#7f8c8d",
                      }}
                    >
                      📊 Hajmi: {(data[i].size / 1024 / 1024).toFixed(2)} MB |
                      📅 Yuklangan:{" "}
                      {new Date(data[i].uploaded_at).toLocaleDateString(
                        "uz-UZ"
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        color: "#95a5a6",
                        wordBreak: "break-all",
                      }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </FormWrapper>

          <DangerButton onClick={handleDelete}>
            🗑️ Barcha audiolarni o'chirish
          </DangerButton>
        </FormContainer>
      </GlobalContainer>
    </div>
  );
}
