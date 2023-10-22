import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// * インターフェイス
interface UserAttrs {
	email: string;
	password: string;
}
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

// * Userスキーマ
const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	// 返って来るuser情報からpassword、__v、_idを削除している
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.__v;
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

// * 静的メソッド
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

// * パスワードの暗号化
userSchema.pre('save', async function (next) {
	// パスワードが変更された時のみハッシュ化する
	if (this.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
	next();
});
// * パスワードの比較
userSchema.methods.comparePassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
