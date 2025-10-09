import Link from "next/link";

export default async function ConfirmationPage({searchParams}) {
    const orderno = await searchParams.orderno;
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
                <p className="text-gray-600 mb-6">
                    Your action has been completed successfully. You will receive a confirmation call shortly.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">
                        <strong>Reference ID:</strong> #{orderno}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link href="/">
                        <button className="flex-1 bg-gradient-to-r from-[#313881] to-[#0678B4] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                            Back to Home
                        </button></Link>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200">
                        Print
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    If you have any questions, contact bookmebdltd@gmail.com
                </p>
            </div>
        </div>
    );
}