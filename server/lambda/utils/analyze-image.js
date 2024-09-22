import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition';
import { fromSSO } from '@aws-sdk/credential-providers';
import fetch from 'node-fetch';
import sharp from 'sharp';

const rekognitionClient = new RekognitionClient({
    region: 'us-east-1',
    credentials: fromSSO({ profile: process.env.PROFILE_NAME })
});

export const analyzeImage = async (imageUrl, valorPix) => {
    const imageBuffer = await getImageBuffer(imageUrl);

    if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error("Buffer da imagem está vazio ou inválido.");
    }

    // Tenta converter a imagem
    try {
        const imageMetadata = await sharp(imageBuffer).metadata();
        let convertedImageBuffer;

        // Se a imagem não for PNG, converta-a para PNG
        if (imageMetadata.format !== 'png') {
            convertedImageBuffer = await sharp(imageBuffer)
                .toFormat('png')
                .toBuffer();
        } else {
            convertedImageBuffer = imageBuffer; // Usar o buffer original se já for PNG
        }

        const params = {
            Image: {
                Bytes: convertedImageBuffer,
            },
            FeatureTypes: ['TEXT_DETECTION'],
        };

        const command = new DetectTextCommand(params);
        const response = await rekognitionClient.send(command);
        const detectedText = response.TextDetections.map(detection => detection.DetectedText).join(' ');
        
        valorPix = valorPix.replace(".",",");
        const isValorPixFound = detectedText.includes("R$"+valorPix);
        const isPixKeyFound = detectedText.includes('pix@gmail.com');

        return { isValorPixFound, isPixKeyFound };
    } catch (error) {
        console.error("Erro ao converter ou processar a imagem:", error);
        throw new Error("Erro ao processar a imagem.");
    }
};

const getImageBuffer = async (imageUrl) => {
    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error("Erro ao buscar a imagem.");
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
};
