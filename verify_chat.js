import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const TEST_MESSAGE = 'What is the capital of France?';

async function verify() {
    console.log('Starting Chat API verification...');

    // 1. Send Message
    console.log(`\n1. Sending message: "${TEST_MESSAGE}"`);
    const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: TEST_MESSAGE })
    });

    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (res.status !== 200) {
        console.error('Chat request failed!');
        process.exit(1);
    }

    if (!data.response || !data.saved_chat) {
        console.error('Invalid response structure!');
        process.exit(1);
    }

    if (data.saved_chat.user_message !== TEST_MESSAGE) {
        console.error('Saved chat message does not match!');
        process.exit(1);
    }

    console.log('\nVerification SUCCESS! ✅');
}

verify().catch(err => {
    console.error('Verification script error:', err);
    process.exit(1);
});
