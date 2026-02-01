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
    }>;
    totalAmount: number;
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
                            data.company ? { type: 'div', props: { children: `Company: ${data.company}` } } : null,
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
                            { type: 'div', props: { style: { flex: 1, textAlign: 'center' }, children: 'Qty' } },
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
                            { type: 'div', props: { style: { flex: 1, textAlign: 'center' }, children: item.quantity.toString() } },
                            { type: 'div', props: { style: { flex: 2, textAlign: 'right' }, children: `Rs. ${item.price}` } },
                            { type: 'div', props: { style: { flex: 2, textAlign: 'right' }, children: `Rs. ${item.price * item.quantity}` } },
                        ]
                    }
                })),

                // TOTAL
                {
                    type: 'div',
                    props: {
                        style: { display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '2px solid black', paddingTop: '10px' },
                        children: [
                            { type: 'div', props: { style: { fontSize: '24px', fontWeight: 'bold' }, children: `Total Amount: Rs. ${data.totalAmount}` } }
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
            // Height is optional or can be estimated. Satori can auto-calculate if we don't set it fixed, or set purely based on content?
            // Satori requires height or auto.
            // For receipts, dynamic height is tricky. Let's set a reasonable min-height or fixed height for now,
            // or just use a tall canvas.
            height: undefined, // Let satori compute height? Satori usually needs dimensions.
            // Actually satori needs width. Height is optional.
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

    // Debug: Save locally
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    const filename = `receipt_${data.orderId}.png`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, pngBuffer);
    console.log(`[Receipt Generation] Saved locally to: ${filePath}`);

    // Upload to Cloudinary
    console.log("[Receipt Generation] Uploading to Cloudinary...");
    const publicId = `receipt_${data.orderId}`;
    const uploadResult = await streamUpload(pngBuffer, 'receipts', 'image', publicId);
    console.log("[Receipt Generation] Upload success:", uploadResult.secure_url);

    // Delete local file after upload
    try {
        fs.unlinkSync(filePath);
        console.log(`[Receipt Generation] Deleted local file: ${filePath}`);
    } catch (err) {
        console.error(`[Receipt Generation] Failed to delete local file: ${filePath}`, err);
    }

    return uploadResult.secure_url;
};
