const { verifySignature } = require('../utils/webhookSignature');
const db = require('../config/db');

exports.handleExternalEvent = async (req, res) => {
    const signature = req.get('X-External-Signature') || '';
    const payload = req.body.toString('utf8'); // Express.raw() ensures req.body is a buffer

    // 1. Signature Verification (401 Unauthorized)
    if (!verifySignature(signature, payload)) {
        console.warn('Webhook: Invalid signature received.');
        return res.status(401).json({ error: 'Invalid signature.' });
    }

    const { event_id, new_status, delivery_id } = JSON.parse(payload);

    // 2. Idempotency Check (Ignore on duplicate)
    try {
        const deliveryCheck = await db.query(
            'SELECT delivery_id FROM webhook_deliveries WHERE delivery_id = $1',
            [delivery_id]
        );

        if (deliveryCheck.rows.length > 0) {
            console.log(`Webhook: Delivery ID ${delivery_id} already processed. Ignoring.`);
            return res.status(202).json({ message: 'Accepted, already processed.' }); // Return 202 Accepted
        }

        // 3. Update Event Status
        const result = await db.query(
            'UPDATE events SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
            [new_status, event_id]
        );

        if (result.rows.length === 0) {
            console.warn(`Webhook: Event ID ${event_id} not found.`);
            return res.status(404).json({ error: 'Event not found.' });
        }

        // 4. Log Successful Delivery
        await db.query(
            'INSERT INTO webhook_deliveries (delivery_id, payload) VALUES ($1, $2)',
            [delivery_id, JSON.parse(payload)]
        );

        console.log(`Webhook: Successfully updated event ${event_id} to ${new_status}.`);
        return res.status(200).json({ message: 'Success' }); // Return fast 2xx
    } catch (error) {
        console.error('Webhook processing failed:', error.message);
        // Log the error but return 500
        return res.status(500).json({ error: 'Server processing error.' });
    }
};