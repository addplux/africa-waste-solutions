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
		return "", fmt.Errorf("minio client not initialized")
	}

	_, err := MinioClient.PutObject(ctx, BucketName, objectName, reader, objectSize, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	// In a real production setup with public access, we'd return a public URL.
	// For this demo, we'll return a path that our backend can use to generate a presigned URL if needed,
	// or just the object name.
	return objectName, nil
}
