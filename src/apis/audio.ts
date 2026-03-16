import type { AxiosInstance } from "axios";

export interface VerseBgm {
  url: string;
  display_name: string;
  index_id: string;
  index: number;
}

export interface VerseTTSVoice {
  url: string;
  ref_id: string;
  index_id: string;
  display_name: string;
  index: number;
}

export interface VerseAudioPresets {
  bgm_list: VerseBgm[];
  tts_voice_ref_id_list: VerseTTSVoice[];
}

export const createAudioApis = (client: AxiosInstance) => {
  const verseAudioPresets = async () => {
    return client
      .get<VerseAudioPresets>("/v1/ai_director_audio_preset")
      .then((res) => res.data);
  };

  return {
    verseAudioPresets,
  };
};
