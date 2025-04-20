const socket = new SockJS('/ws');

const stompClient = Stomp.over(socket); //пока хз где найти Stomp

stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    const channelId = '123';

    //подписка за топик для слушанья
    stompClient.subscribe('/topic/channel/' + channelId, function (message) {
        console.log('Received message: ' + message.body);
    });

    //запрос на бэк чтобы создать создать связи подключения
    stompClient.send("/app/channel/" + channelId + "/subscribe", {}, JSON.stringify({}));
});