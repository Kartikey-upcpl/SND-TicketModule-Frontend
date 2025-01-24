"use client"
import React, { useEffect, useState } from 'react';
import { fetchUploadedMediaAction } from '@/api/action/mediaAction';

const ImageGallery: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch images from the backend
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const MediaData = await fetchUploadedMediaAction();
                setImages(MediaData?.images);
            } catch (error: any) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>

            {loading && <p className="text-gray-500">Loading images...</p>}

            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && images.length === 0 && (
                <p className="text-gray-500">No images found.</p>
            )}

            {!loading && !error && images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="border rounded shadow">
                            <img
                                src={image}
                                alt={`Uploaded Image ${index + 1}`}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
