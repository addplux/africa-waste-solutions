package utils

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var MinioClient *minio.Client
var BucketName string

func InitStorage() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	BucketName = os.Getenv("MINIO_BUCKET")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"

	if endpoint == "" {
		log.Println("MINIO_ENDPOINT not set, skipping storage init")
		return
	}

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalln("Error creating MinIO client:", err)
	}

	MinioClient = client

	// Check/Create Bucket
	ctx := context.Background()
	exists, err := MinioClient.BucketExists(ctx, BucketName)
	if err != nil {
		log.Println("Error checking bucket existence:", err)
		return
	}

	if !exists {
		err = MinioClient.MakeBucket(ctx, BucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Println("Error creating bucket:", err)
			return
		}
		log.Printf("Successfully created bucket: %s\n", BucketName)
	}
}

func UploadToMinio(ctx context.Context, objectName string, reader io.Reader, objectSize int64, contentType string) (string, error) {
	if MinioClient == nil {
		// FALLBACK: Save to local filesystem if MinIO is not initialized
		log.Println("[STORAGE] MinIO not initialized, falling back to local storage")

		uploadDir := "./uploads/kyc"
		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			return "", fmt.Errorf("failed to create local upload directory: %v", err)
		}

		filePath := fmt.Sprintf("%s/%s", uploadDir, objectName)
		file, err := os.Create(filePath)
		if err != nil {
			return "", fmt.Errorf("failed to create local file: %v", err)
		}
		defer file.Close()

		_, err = io.Copy(file, reader)
		if err != nil {
			return "", fmt.Errorf("failed to save local file: %v", err)
		}

		log.Printf("[STORAGE] Saved file locally: %s\n", filePath)
		return filePath, nil
	}

	_, err := MinioClient.PutObject(ctx, BucketName, objectName, reader, objectSize, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	return objectName, nil
}
