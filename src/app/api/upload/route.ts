import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        // Cloudinary configuration
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        console.log('File received:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Get the current image URL from settings
        const { data: currentSettings } = await supabase
            .from('settings')
            .select('value')
            .eq('name', `${type}_url`)
            .single();

        // If there's an existing image, delete it from Cloudinary
        if (currentSettings?.value) {
            try {
                const urlParts = currentSettings.value.split('/');
                const filenameWithExtension = urlParts[urlParts.length - 1];
                const publicId = `qr-menu/${type}s/${filenameWithExtension.split('.')[0]}`;

                console.log('Attempting to delete:', publicId);
                await cloudinary.uploader.destroy(publicId);
                console.log('Successfully deleted old image');
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `qr-menu/${type}s`,
                    public_id: `${type}_${Date.now()}`,
                    resource_type: 'image',
                    ...(type === 'favicon' && {
                        width: 32,
                        height: 32,
                        crop: 'fill'
                    })
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Upload successful:', result);
                        resolve(result);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        if (!result || typeof result !== 'object' || !('secure_url' in result)) {
            console.error('Invalid result from Cloudinary:', result);
            throw new Error('Invalid upload result');
        }

        return NextResponse.json({ url: result.secure_url });

    } catch (error: any) {
        console.error('Detailed upload error:', {
            message: error.message,
            stack: error.stack,
            details: error
        });

        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        );
    }
} 