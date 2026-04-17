const express = require('express');
const { submitReservation } = require('../services/reservation-service');

const router = express.Router();

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function isValidPhone(value = '') {
  return /^[+\d()\s-]{6,20}$/.test(String(value).trim());
}

router.post('/api/reservations', async (req, res, next) => {
  try {
    const payload = {
      name: String(req.body.name || '').trim(),
      email: String(req.body.email || '').trim(),
      phone: String(req.body.phone || '').trim(),
      date: String(req.body.date || '').trim(),
      time: String(req.body.time || '').trim(),
      reservation_type: String(req.body.reservation_type || '').trim(),
      reservation_kind: String(req.body.reservation_kind || '').trim(),
      guests: String(req.body.guests || '').trim(),
      comment: String(req.body.comment || '').trim()
    };

    if (!payload.name || !payload.phone || !payload.date || !payload.time || !payload.reservation_type || !payload.guests) {
      return res.status(400).json({ message: 'Missing required reservation fields.' });
    }

    if (payload.email && !isValidEmail(payload.email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    if (!isValidPhone(payload.phone)) {
      return res.status(400).json({ message: 'Invalid phone number.' });
    }

    await submitReservation(payload);
    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error.message === 'Reservation delivery is not configured yet.') {
      return res.status(503).json({ message: error.message });
    }

    return next(error);
  }
});

module.exports = router;
