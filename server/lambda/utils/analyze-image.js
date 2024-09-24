import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'; 
import { fromSSO } from '@aws-sdk/credential-providers';

const rekognitionClient = new RekognitionClient({
    region: 'us-east-1',
    credentials: fromSSO({ profile: process.env.PROFILE_NAME })
});

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: fromSSO({ profile: process.env.PROFILE_NAME })
});

export const analyzeImage = async (imageKey, valorPix) => {
    const bucketName = process.env.S3_BUCKET_NAME;

    const params = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: `comprovantes/${imageKey}.png`
            }
        },
        FeatureTypes: ['TEXT_DETECTION'],
    };

    try {
        const command = new DetectTextCommand(params);
        const response = await rekognitionClient.send(command);

        const detectedText = response.TextDetections.map(detection => detection.DetectedText).join(' ');

        valorPix = valorPix.replace(".", ",");
        const isValorPixFound = detectedText.includes("R$" + valorPix);
        const isPixKeyFound = detectedText.includes('pix@gmail.com');

        if (!isValorPixFound || !isPixKeyFound) {
            // Caso os dados não confiram, deleta a imagem
            await deleteImageFromS3(bucketName, `comprovantes/${imageKey}.png`);
            return { isValorPixFound, isPixKeyFound, status: 'Image deleted from S3' };
        }

        return { isValorPixFound, isPixKeyFound, status: 'Verified' };

    } catch (InvalidS3ObjectException) {
        console.error("Erro ao analisar a imagem:", error);
        throw new Error("Erro ao processar a imagem.");
    } 
};

// Função para deletar a imagem do S3
const deleteImageFromS3 = async (bucketName, imageKey) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: imageKey
        };
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        console.log(`Imagem ${imageKey} removida com sucesso do S3.`);
    } catch (error) {
        console.error("Erro ao remover a imagem do S3:", error);
        throw new Error("Erro ao remover a imagem do S3.");
    }
};
