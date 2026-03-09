export const createAudioApis = (client) => {
    const verseAudioPresets = async () => {
        return client
            .get("/v1/ai_director_audio_preset")
            .then((res) => res.data);
    };
    return {
        verseAudioPresets,
    };
};
