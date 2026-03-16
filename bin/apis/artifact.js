export const createArtifactApis = (client) => {
    const makeImage = async (payload, config) => {
        return client
            .post("/v3/make_image", payload, config)
            .then((res) => res.data);
    };
    const makeVideo = async (payload, config) => {
        return client
            .post("/v3/make_video", payload, config)
            .then((res) => res.data);
    };
    const editImage = async (payload, config) => {
        return client
            .post("/v1/image_edit_v1/task", payload, config)
            .then((res) => res.data);
    };
    const task = async (task_uuid, config) => {
        return client
            .get(`/v1/artifact/task/${task_uuid}`, config)
            .then((res) => res.data);
    };
    const mergeMedia = async (payload, config) => {
        return client
            .post("/v3/merge_media/v3/submit_task", payload, config)
            .then((res) => res.data);
    };
    const makeSong = async (prompt, lyrics, meta, config) => {
        return client
            .post("/v3/make_song", {
            prompt,
            lyrics,
            meta,
        }, config)
            .then((res) => res.data);
    };
    const postProcess = async (uuid, preset, meta, config) => {
        return client
            .post("/v3/make_face_detailer", {
            source_artifact_uuid: uuid,
            preset_key: preset,
            meta,
        }, config)
            .then((res) => res.data);
    };
    const artifactDetail = async (uuids) => {
        return client
            .get("/v1/artifact/artifact-detail", {
            params: {
                uuids: uuids.join(","),
            },
        })
            .then((res) => res.data);
    };
    return {
        makeImage,
        makeVideo,
        editImage,
        makeSong,
        mergeMedia,
        postProcess,
        task,
        artifactDetail,
    };
};
