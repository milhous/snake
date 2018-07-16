const script = `
    onmessage = function(message) {
        const data = message.data;
        postMessage(data);
    };
`;
const blob = new Blob([script], { type: "application/octet-binary" });
const blobURL = URL.createObjectURL(blob);

const worker = new Worker(blobURL);

worker.onerror = function(error) {
    console.log(error.filename, error.lineno, error.message);
}

export default worker;