import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import streamUpload from "@/lib/uploadoncloudinary";
import fs from 'fs';
import path from 'path';

interface ReceiptData {
    orderId: string;
    date: Date;
    fullName: string;
    email: string;
    phoneno: string | number;
    address: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
        unit?: string;
    }>;
    totalAmount: number;
    subtotal?: number;
    tax?: number;
    company?: string;
}

// Helper to fetch font or load from fs
async function loadFont() {
    try {
        const fontPath = path.join(process.cwd(), 'src', 'lib', 'fonts', 'arial.ttf');
        const fontData = fs.readFileSync(fontPath);
        return fontData;
    } catch (e) {
        console.warn("Could not load local font file:", e);
        throw e;
    }
}

export const generateReceipt = async (data: ReceiptData): Promise<string> => {
    const fontData = await loadFont();

    const element = {
        type: 'div',
        props: {
            style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                padding: '40px',
                fontFamily: 'Arial',
                color: 'black',
            },
            children: [
                // Header
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' },
                        children: [
                            { type: 'h1', props: { style: { fontSize: '32px', margin: 0 }, children: "Sai PSB Laboratory" } },
                            { type: 'h2', props: { style: { fontSize: '20px', margin: '10px 0 0 0', fontWeight: 'normal', color: '#555' }, children: "Chemical Store Receipt" } }
                        ]
                    }
                },

                // ORDER DETAILS
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', flexDirection: 'column', marginBottom: '30px', fontSize: '16px' },
                        children: [
                            { type: 'div', props: { children: `Order ID: ${data.orderId}` } },
                            { type: 'div', props: { children: `Date: ${data.date.toLocaleDateString()}` } },
                            data.company ? { type: 'div', props: { children: `Lab Name / Company: ${data.company}` } } : null,
                            { type: 'div', props: { children: `Customer: ${data.fullName}` } },
                            { type: 'div', props: { children: `Email: ${data.email}` } },
                            { type: 'div', props: { children: `Phone: ${data.phoneno}` } },
                            { type: 'div', props: { children: `Address: ${data.address}` } },
                        ]
                    }
                },

                // TABLE HEADER
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '10px', fontWeight: 'bold', fontSize: '18px' },
                        children: [
                            { type: 'div', props: { style: { flex: 4 }, children: 'Item' } },
                            { type: 'div', props: { style: { flex: 1, textAlign: 'center' }, children: 'Qty / Amt' } },
                            { type: 'div', props: { style: { flex: 2, textAlign: 'right' }, children: 'Price' } },
                            { type: 'div', props: { style: { flex: 2, textAlign: 'right' }, children: 'Total' } },
                        ]
                    }
                },

                // ITEMS
                ...data.items.map(item => ({
                    type: 'div',
                    props: {
                        style: { display: 'flex', borderBottom: '1px solid #eee', padding: '10px 0', fontSize: '16px' },
                        children: [
                            { type: 'div', props: { style: { flex: 4 }, children: item.name } },
                            { type: 'div', props: { style: { flex: 1, textAlign: 'center' }, children: `${item.quantity} ${item.unit || "mg"}` } },
                            { type: 'div', props: { style: { flex: 2, textAlign: 'right' }, children: `Rs. ${item.price}` } },
                            { type: 'div', props: { style: { flex: 2, textAlign: 'right' }, children: `Rs. ${item.price * item.quantity}` } },
                        ]
                    }
                })),

                // TOTAL SECTION
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '20px', borderTop: '2px solid black', paddingTop: '10px' },
                        children: [
                            data.subtotal ? {
                                type: 'div',
                                props: { style: { fontSize: '16px', marginBottom: '5px' }, children: `Subtotal: Rs. ${data.subtotal}` }
                            } : null,
                            data.tax ? {
                                type: 'div',
                                props: { style: { fontSize: '16px', marginBottom: '10px' }, children: `Tax (18% GST): Rs. ${data.tax}` }
                            } : null,
                            {
                                type: 'div',
                                props: { style: { fontSize: '24px', fontWeight: 'bold' }, children: `Total Amount: Rs. ${data.totalAmount}` }
                            }
                        ]
                    }
                },

                // FOOTER
                {
                    type: 'div',
                    props: {
                        style: { marginTop: 'auto', textAlign: 'center', fontSize: '14px', color: '#777' },
                        children: "Thank you for your business!"
                    }
                }
            ]
        }
    };

    // Use Satori to generate SVG
    const svg = await satori(
        element as any,
        {
            width: 800,
            height: undefined,
            fonts: [
                {
                    name: 'Arial',
                    data: fontData,
                    weight: 400,
                    style: 'normal',
                },
            ],
        }
    );

    // Use Resvg to generate PNG
    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: 800,
        },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // Upload to Cloudinary
    console.log("[Receipt Generation] Uploading to Cloudinary...");
    const publicId = `receipt_${data.orderId}`;
    const uploadResult = await streamUpload(pngBuffer, 'receipts', 'image', publicId);
    console.log("[Receipt Generation] Upload success:", uploadResult.secure_url);

    return uploadResult.secure_url;
};
