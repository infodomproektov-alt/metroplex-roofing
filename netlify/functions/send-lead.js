exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) };

  try {
    const data = JSON.parse(event.body || '{}');
    if (data.website) return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    const phone = String(data.phone || '').trim();
    if (!phone) return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'phone_required' }) };

    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'env_not_configured' }) };

    const text = [
      'Новая заявка METROPLEX',
      `Телефон: ${phone}`,
      data.name ? `Имя: ${data.name}` : '',
      data.object_type ? `Тип объекта: ${data.object_type}` : '',
      data.service ? `Задача: ${data.service}` : '',
      data.message ? `Сообщение: ${data.message}` : '',
      data.page ? `Страница: ${data.page}` : '',
      data.language ? `Язык: ${data.language}` : '',
      data.utm ? `UTM: ${data.utm}` : ''
    ].filter(Boolean).join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });
    if (!tgRes.ok) {
      const details = await tgRes.text();
      return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'telegram_failed', details }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'server_error' }) };
  }
};
