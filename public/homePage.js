const logoutButton = new LogoutButton()
const ratesBoard = new RatesBoard();
const favouritesWidget = FavoritesWidget();
const moneyManager = new MoneyManager();


ApiConnector.current(response => {
    if(response.success){
        ProfileWidget.showProfile(response.data)
    }
});
logoutButton.action = () => {
    ApiConnector.logout((response) => {
      if (response.success) {
        location.reload();
      } else {
        console.error(response.error);
      }
    });
  };

const updateStocks = () => {
    ApiConnector.getStocks(response => {
        if(response.success){
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data)
        } else {
            console.error(response.error)
        }
    })
}
setInterval(updateStocks, 60000);



moneyManager.addMoneyCallback = () => {
    ApiConnector.addMoney((data, response) => {
        if(response.success){
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(true, 'Баланс пополнен')
        } else {
            moneyManager.setMessage(false, 'Ошибка')
        }
    })
}

moneyManager.conversionMoneyCallback(data => ApiConnector.convertMoney(data, response => {
    if(response.success){
        ProfileWidget.showProfile(data);
        moneyManager.setMessage(true, 'Успешная конвертация')
    } else {
        moneyManager.setMessage(false, response.error)
    }
}))

moneyManager.sendMoneyCallback(data => ApiConnector.transferMoney(data, response => {
    if(response.success){
        ProfileWidget.showProfile(data);
        moneyManager.setMessage(true, 'Деньги отправлены')
    } else {
        moneyManager.setMessage(false, response.error)
    }
}))

favouritesWidget.getFavourites(response => {
    if(response.success){
        favouritesWidget.clearTable();
        favouritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favouritesWidget.setMessage(true, 'Пользователь добавлен')
    } else {
        favouritesWidget.setMessage(false, response.error)
    }
})
favouritesWidget.removeUserCallback = () => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if(response.success){
            favouritesWidget.clearTable();
            favouritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favouritesWidget.setMessage(true, 'Пользователь удалён')
        } else {
            favouritesWidget.setMessage(false, response.error);
        }
    })
}




