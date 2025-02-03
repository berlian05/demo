const TELEGRAM_BOT_TOKEN = '7993946782:AAEgeQAdJgndQN7M7DCsmco63F3t90ITNxM';
// Замените на новый ID группы, который вы получили от @getmyid_bot
const TELEGRAM_CHAT_ID = '-1002347225027';

async function sendTelegramNotification(repair) {
    try {
        const message = formatRepairMessage(repair);
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (!data.ok) {
            throw new Error(`Telegram API Error: ${data.description}`);
        }
        
        console.log('Уведомление успешно отправлено в Telegram');
        return true;
    } catch (error) {
        console.error('Ошибка отправки уведомления:', error);
        return false;
    }
}

function formatRepairMessage(repair) {
    const type = repair.isEmergency ? '🚨 ВНЕПЛАНОВОЕ ОТКЛЮЧЕНИЕ' : '🔧 Плановые работы';
    const status = repair.resolved ? '✅ Завершено' : '🔄 В работе';
    const startDate = new Date(repair.startDate).toLocaleString('ru-RU');
    const endDate = repair.endDate ? new Date(repair.endDate).toLocaleString('ru-RU') : 'Не указано';

    return `
<b>${type}</b>

📍 <b>Город:</b> ${repair.city}
🏠 <b>Адрес:</b> 
${repair.streets.map((street, i) => `- ул. ${street}, дома: ${repair.houses[i]}`).join('\n')}

⏰ <b>Начало работ:</b> ${startDate}
🏁 <b>Планируемое окончание:</b> ${endDate}

<b>Статус:</b> ${status}
`;
}

// Функция для тестового сообщения
async function sendTestMessage() {
    const testRepair = {
        city: 'Тестовый город',
        streets: ['Тестовая улица'],
        houses: ['1'],
        isEmergency: false,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        resolved: false
    };

    const result = await sendTelegramNotification(testRepair);
    if (result) {
        alert('Тестовое сообщение успешно отправлено!');
    } else {
        alert('Ошибка отправки тестового сообщения');
    }
} 