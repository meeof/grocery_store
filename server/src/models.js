import {DataTypes} from 'sequelize';
import {sequelize} from "./db.js";

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email : {type: DataTypes.STRING, allowNull: false, unique: true},
    password : {type: DataTypes.STRING, allowNull: false},
    salt: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'ADMIN'}
});
const UserInfo = sequelize.define('user_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name : {type: DataTypes.STRING, allowNull: false},
    surname : {type: DataTypes.STRING, allowNull: false},
    language : {type: DataTypes.STRING, defaultValue: 'RU'},
    phone : {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING},
    about: {type: DataTypes.STRING},
});
const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
const BasketItem = sequelize.define('basket_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, defaultValue: 1, allowNull: false},
});
const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
});
const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name : {type: DataTypes.STRING, allowNull: false},
    price : {type: DataTypes.REAL, allowNull: false},
    discount : {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
    images : {type: DataTypes.JSON},
});
const Comparison = sequelize.define('comparison', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
const ItemInfo = sequelize.define('item_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title : {type: DataTypes.STRING, allowNull: false},
    description : {type: DataTypes.STRING, allowNull: false},
});
const Categories = sequelize.define('categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name : {type: DataTypes.STRING, allowNull: false},
});
const Orders = sequelize.define('orders', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name : {type: DataTypes.STRING, allowNull: false},
    surname : {type: DataTypes.STRING, allowNull: false},
    phone : {type: DataTypes.STRING, allowNull: false},
    point : {type: DataTypes.STRING, allowNull: false},
    delivery: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    comment: {type: DataTypes.STRING},
    sms: {type: DataTypes.BOOLEAN, allowNull: false},
    full_price: {type: DataTypes.REAL, allowNull: false},
    items:  {type: DataTypes.JSON, allowNull: false},
    status: {type: DataTypes.STRING, allowNull: false},
    delivery_date: {type: DataTypes.DATE, allowNull: false}
});
const WasBought = sequelize.define('was_bought', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    itemId: {type: DataTypes.INTEGER, allowNull: false},
});
const Reviews = sequelize.define('reviews' , {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    itemId: {type: DataTypes.INTEGER, allowNull: false},
    images: {type: DataTypes.JSON},
    review: {type: DataTypes.STRING, allowNull: false},
})


User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(UserInfo);
UserInfo.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

User.hasOne(Comparison);
Comparison.belongsTo(User);

Basket.hasMany(BasketItem);
BasketItem.belongsTo(Basket);

Item.hasOne(BasketItem);
BasketItem.belongsTo(Item);

Item.hasMany(Rating);
Rating.belongsTo(Item);

Item.hasMany(ItemInfo);
ItemInfo.belongsTo(Item);

Categories.hasMany(Item);
Item.belongsTo(Categories);

Basket.hasMany(Orders);
Orders.belongsTo(Basket);

export {Categories, ItemInfo, Comparison, Item, Rating, BasketItem, Basket, UserInfo, User, Orders, WasBought, Reviews};