export const getDataUri = (file) => {
    if (!file || !file.mimetype || !file.buffer) {
        throw new Error("Invalid file data");
    }

    // Extract file extension from MIME type
    const mimeType = file.mimetype.split("/");
    const extName = mimeType[1]; 

    const fileBuffer = file.buffer.toString("base64");

    return {
        content: `data:${file.mimetype};base64,${fileBuffer}`,
    };
};