"use client"
import React, { useEffect, useState } from 'react';
import { fetchUploadedMediaAction } from '@/api/action/mediaAction';
import Link from 'next/link';
import Image from 'next/image';

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

    const mimeMap: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        mp4: 'video/mp4',
        mpeg: 'video/mpeg',
        avi: 'video/avi',
    };

    function getMimeType(link: string): string | null {
        const extension = link.split('.').pop()?.toLowerCase();
        return extension && mimeMap[extension] ? mimeMap[extension] : null;
    }
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
                    {images.map((image, index) => {

                        const mimeType = getMimeType(image.trim());
                        const isImage = ["image/jpeg", "image/png", "image/gif"].includes(mimeType || "");
                        const isVideo = ["video/mp4", "video/mpeg", "video/avi"].includes(mimeType || "");

                        return isImage ? (
                            <Link
                                key={`image-${index}`}
                                href={image.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-auto object-cover p-5"
                            >
                                <Image
                                    width={500}
                                    height={500}
                                    src={image.trim()}
                                    alt={`Uploaded image ${index + 1}`}
                                    className=""
                                />
                            </Link>
                        ) : isVideo ? (
                            <Link
                                key={`video-${index}`}
                                href={image.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-auto object-cover p-5"
                            >
                                <video
                                    src={image.trim()}
                                    className="w-full h-full"
                                    controls
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </Link>
                        ) : (
                            <p key={`unsupported-${index}`} className="text-red-500">
                                Unsupported media type.
                            </p>
                        );

                        // <div key={index} className="border rounded shadow">
                        //     <img
                        //         src={image}
                        //         alt={`Uploaded Image ${index + 1}`}
                        //         className="w-full h-auto object-cover"
                        //     />
                        // </div>
                    })}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
