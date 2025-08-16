using Amazon.S3;
using Amazon.S3.Model;
using HTC.Backend.Configurations;
using Microsoft.Extensions.Options;

namespace HTC.Backend.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly AwsSettings _awsSettings;

    public S3Service(IAmazonS3 s3Client, IOptions<AwsSettings> awsSettings)
    {
        _s3Client = s3Client;
        _awsSettings = awsSettings.Value;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string location)
    {
        var key = $"{location}/{Guid.NewGuid()}_{file.FileName}";
        
        using var stream = file.OpenReadStream();
        
        var request = new PutObjectRequest
        {
            BucketName = _awsSettings.BucketName,
            Key = key,
            InputStream = stream,
            ContentType = file.ContentType,
            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
        };

        await _s3Client.PutObjectAsync(request);
        
        return key;
    }

    public async Task<string> GetPresignedUrlAsync(string key, string location)
    {
        if (string.IsNullOrEmpty(key))
            return string.Empty;

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _awsSettings.BucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddHours(1),
            Verb = HttpVerb.GET
        };

        return await _s3Client.GetPreSignedURLAsync(request);
    }

    public async Task<bool> DeleteFileAsync(string key, string location)
    {
        if (string.IsNullOrEmpty(key))
            return false;

        try
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _awsSettings.BucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(request);
            return true;
        }
        catch
        {
            return false;
        }
    }
}