"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model, sequelize) {
        this.model = sequelize.getRepository(model);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base-repository.js.map