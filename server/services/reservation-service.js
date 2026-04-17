const { env } = require('../config/env');

function isReservationConfigured() {
  return Boolean(
    env.reservation.web3formsKey &&
    env.reservation.telegramBotToken &&
    env.reservation.telegramChatId
  );
}

function buildReservationMessage(payload) {
  return [
    'New Reservation',
    '',
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email || '-'}`,
    `Type: ${payload.reservation_type}`,
    `Date: ${payload.date}`,
    `Time: ${payload.time}`,
    `Guests: ${payload.guests}`,
    `Comment: ${payload.comment || '-'}`
  ].join('\n');
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

async function submitReservation(payload) {
  if (!isReservationConfigured()) {
    throw new Error('Reservation delivery is not configured yet.');
  }

  const message = buildReservationMessage(payload);

  await Promise.all([
    postJson('https://api.web3forms.com/submit', {
      access_key: env.reservation.web3formsKey,
      subject: `New reservation for ${payload.date} at ${payload.time}`,
      from_name: 'DownTown Reservation Form',
      name: payload.name,
      email: payload.email || env.reservation.restaurantEmail,
      replyto: payload.email || env.reservation.restaurantEmail,
      message,
      reservation_type: payload.reservation_type,
      reservation_kind: payload.reservation_kind,
      phone: payload.phone,
      date: payload.date,
      time: payload.time,
      guests: payload.guests,
      comment: payload.comment || '-'
    }),
    postJson(`https://api.telegram.org/bot${env.reservation.telegramBotToken}/sendMessage`, {
      chat_id: env.reservation.telegramChatId,
      text: message
    })
  ]);
}

module.exports = {
  isReservationConfigured,
  submitReservation
};
