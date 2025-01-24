import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

// Create a new product
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Görsel yüklemek zorunludur' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using stream
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'qr-menu/products',
                    public_id: `product_${Date.now()}`,
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Upload successful:', result);
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: 'Görsel yüklenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}



// Delete a product
export async function DELETE(request: Request) {
    try {
        const { public_id } = await request.json();

        if (!public_id) {
            return NextResponse.json(
                { error: 'Public ID gerekli' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);

        return NextResponse.json({
            result: result.result
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Görsel silinirken bir hata oluştu' },
            { status: 500 }
        );
    }
}
