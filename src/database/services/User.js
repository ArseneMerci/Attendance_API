import User from '../models/userModel'

class UserService {
  static async signUp(newUser) {
    try {
      return await User.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async findUser(user) {
    try {
      return await User.findOne(user);
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(filter, update) {
    try {
      return await User.findOneAndUpdate(filter, update, { new: true });
    } catch (error) {
      throw error;
    }
  }

  static async findAllUsers() {
    try {
      return await User.find()
        .sort({ createdAt: -1 })
        .select('-password -token')
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(user) {
    try {
      return await User.deleteOne(user)
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
