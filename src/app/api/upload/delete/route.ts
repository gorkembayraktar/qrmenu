import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: Request) {
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

        // Get type from URL
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!type || !['logo', 'favicon'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid type parameter' },
                { status: 400 }
            );
        }

        // Get current image URL from settings
        const { data: currentSettings } = await supabase
            .from('settings')
            .select('value')
            .eq('name', `${type}_url`)
            .single();

        if (currentSettings?.value) {
            try {
                // Delete from Cloudinary
                const urlParts = currentSettings.value.split('/');
                const filenameWithExtension = urlParts[urlParts.length - 1];
                const publicId = `qr-menu/${type}s/${filenameWithExtension.split('.')[0]}`;

                console.log('Attempting to delete:', publicId);
                await cloudinary.uploader.destroy(publicId);
                console.log('Successfully deleted from Cloudinary');

                // Update settings in database
                const { error: updateError } = await supabase
                    .from('settings')
                    .update({ value: '' })
                    .eq('name', `${type}_url`);

                if (updateError) throw updateError;

                return NextResponse.json({
                    message: `${type === 'logo' ? 'Logo' : 'Favicon'} başarıyla kaldırıldı`
                });
            } catch (error) {
                console.error('Delete error:', error);
                throw error;
            }
        }

        return NextResponse.json({
            message: `${type === 'logo' ? 'Logo' : 'Favicon'} zaten mevcut değil`
        });

    } catch (error: any) {
        console.error('Delete operation error:', error);
        return NextResponse.json(
            { error: error.message || 'Silme işlemi başarısız oldu' },
            { status: 500 }
        );
    }
} 