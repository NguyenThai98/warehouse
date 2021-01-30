/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100417
 Source Host           : localhost:3306
 Source Schema         : dbwarehouse

 Target Server Type    : MySQL
 Target Server Version : 100417
 File Encoding         : 65001

 Date: 30/01/2021 14:10:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`  (
  `id_account` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `rfid` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `password` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `user_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `isLive` int(11) NULL DEFAULT NULL,
  `roomUser` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_account`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of account
-- ----------------------------
INSERT INTO `account` VALUES (1, 'Nguyễn Trọng Thái', '1312A31BAADACAS1A3C2VA233C', '$2a$12$CwqZuLvMtdZCEU7O0wbRLuPhu4biGF1pINBWJ8afzU2QOOf9nujqK', 'thaigogo', 'f7ac7d446c538eea8a638e9189421773', 1, 'Phong Vip 1');

-- ----------------------------
-- Table structure for account_role
-- ----------------------------
DROP TABLE IF EXISTS `account_role`;
CREATE TABLE `account_role`  (
  `id_account_role` int(11) NOT NULL AUTO_INCREMENT,
  `id_account` int(11) NULL DEFAULT NULL,
  `id_role` int(11) NULL DEFAULT NULL,
  `status_account` int(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id_account_role`) USING BTREE,
  INDEX `FK_account_role_id_account_account_id_account`(`id_account`) USING BTREE,
  INDEX `FK_account_role_id_role_role_id_role`(`id_role`) USING BTREE,
  CONSTRAINT `FK_account_role_id_account_ara_account_id_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_account_role_id_role_ar_role_id_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of account_role
-- ----------------------------
INSERT INTO `account_role` VALUES (1, 1, 8, 1);
INSERT INTO `account_role` VALUES (2, 1, 3, 1);
INSERT INTO `account_role` VALUES (3, 1, 4, 1);
INSERT INTO `account_role` VALUES (4, 1, 1, 1);
INSERT INTO `account_role` VALUES (5, 1, 2, 1);
INSERT INTO `account_role` VALUES (6, 1, 6, 1);
INSERT INTO `account_role` VALUES (7, 1, 5, 1);
INSERT INTO `account_role` VALUES (8, 1, 9, 1);
INSERT INTO `account_role` VALUES (9, 1, 7, 1);

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id_category` int(11) NOT NULL AUTO_INCREMENT,
  `name_category` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_shelf` int(11) NOT NULL,
  `id_menu` int(11) NOT NULL,
  PRIMARY KEY (`id_category`) USING BTREE,
  INDEX `FK_category_id_shelf_cs_shelf_id_shelf`(`id_shelf`) USING BTREE,
  INDEX `FK_category_id_menu_id`(`id_menu`) USING BTREE,
  CONSTRAINT `FK_category_id_menu_id` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_category_id_shelf_cs_shelf_id_shelf` FOREIGN KEY (`id_shelf`) REFERENCES `shelf` (`id_shelf`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, 'Dụng cụ cắt', 1, 1);
INSERT INTO `category` VALUES (2, 'Dụng cụ tỉa', 5, 1);
INSERT INTO `category` VALUES (3, 'Dụng cụ gọt', 2, 2);
INSERT INTO `category` VALUES (11, 'Dụng cụ cắt', 3, 2);

-- ----------------------------
-- Table structure for device
-- ----------------------------
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device`  (
  `id_device` int(11) NOT NULL AUTO_INCREMENT,
  `name_device` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `id_product` int(11) NULL DEFAULT NULL,
  `pos_x` int(11) NULL DEFAULT NULL,
  `pos_y` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `note` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `date_in` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `rfid` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `id_auth_account` int(11) NULL DEFAULT NULL,
  `isLive` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_device`) USING BTREE,
  INDEX `FK_device_id_product_product_id_product`(`id_device`) USING BTREE,
  INDEX `FK_device_id_product_dp_product_id_product`(`id_product`) USING BTREE,
  CONSTRAINT `FK_device_id_product_dp_product_id_product` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id_menu` int(255) NOT NULL AUTO_INCREMENT,
  `name_menu` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_menu`) USING BTREE,
  INDEX `id_menu`(`id_menu`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, 'Dụng cụ đo');
INSERT INTO `menu` VALUES (2, 'Dụng cụ gọt');
INSERT INTO `menu` VALUES (3, 'Dụng cụ tỉa');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `id_product` int(11) NOT NULL AUTO_INCREMENT,
  `name_product` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `id_category` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id_product`) USING BTREE,
  INDEX `FK_product_id_category_pc_category_id_category`(`id_category`) USING BTREE,
  INDEX `FK_product_id_category_category_id_category`(`id_product`) USING BTREE,
  CONSTRAINT `FK_product_id_category_pc_category_id_category` FOREIGN KEY (`id_category`) REFERENCES `category` (`id_category`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (1, 'Kéo', 3);
INSERT INTO `product` VALUES (2, 'Dao', 1);
INSERT INTO `product` VALUES (3, 'Liềm', 2);
INSERT INTO `product` VALUES (4, 'Búa', 2);
INSERT INTO `product` VALUES (5, 'Tua víc', 1);
INSERT INTO `product` VALUES (6, 'Ca lê', 1);

-- ----------------------------
-- Table structure for report
-- ----------------------------
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report`  (
  `id_report` int(11) NOT NULL AUTO_INCREMENT,
  `id_account` int(11) NULL DEFAULT NULL,
  `id_device` int(11) NULL DEFAULT NULL,
  `date_rent` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `date_back` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `note_report` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `id_report_status` int(11) NULL DEFAULT NULL,
  `isApprove` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_report`) USING BTREE,
  INDEX `FK_report_id_account_ra_account_id_account`(`id_account`) USING BTREE,
  INDEX `FK_report_id_device_rd_device_id_device`(`id_device`) USING BTREE,
  INDEX `FK_report_id_device_device_id_device`(`id_report`) USING BTREE,
  INDEX `FK_report_id_report_status_rrs_report_status_id_report_status`(`id_report_status`) USING BTREE,
  CONSTRAINT `FK_report_id_account_ra_account_id_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_report_id_device_rd_device_id_device` FOREIGN KEY (`id_device`) REFERENCES `device` (`id_device`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_report_id_report_status_rrs_report_status_id_report_status` FOREIGN KEY (`id_report_status`) REFERENCES `report_status` (`id_report_status`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for report_status
-- ----------------------------
DROP TABLE IF EXISTS `report_status`;
CREATE TABLE `report_status`  (
  `id_report_status` int(11) NOT NULL AUTO_INCREMENT,
  `name_report_status` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_report_status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of report_status
-- ----------------------------
INSERT INTO `report_status` VALUES (1, 'MUON');
INSERT INTO `report_status` VALUES (2, 'TRA');
INSERT INTO `report_status` VALUES (3, 'DANG_KY_TU_XA');
INSERT INTO `report_status` VALUES (4, 'LAY');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id_role` int(11) NOT NULL AUTO_INCREMENT,
  `name_role` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_role`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'MUON_TRA');
INSERT INTO `role` VALUES (2, 'LAY_DUNG_CU');
INSERT INTO `role` VALUES (3, 'DUYET_DUNG_CU');
INSERT INTO `role` VALUES (4, 'THEM_DUNG_CU');
INSERT INTO `role` VALUES (5, 'XUAT_FILE_KIEM_KE');
INSERT INTO `role` VALUES (6, 'DANG_KY_TU_XA');
INSERT INTO `role` VALUES (7, 'CAP_NHAT_CL_DUNG_CU');
INSERT INTO `role` VALUES (8, 'PHAN_QUYEN_CAP_NHAT_MK');
INSERT INTO `role` VALUES (9, 'TAO_TAI_KHOAN');

-- ----------------------------
-- Table structure for shelf
-- ----------------------------
DROP TABLE IF EXISTS `shelf`;
CREATE TABLE `shelf`  (
  `id_shelf` int(11) NOT NULL AUTO_INCREMENT,
  `name_shelf` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `id_wh` int(11) NULL DEFAULT NULL,
  `total_slot` int(11) NULL DEFAULT NULL,
  `total_slotEmpty` int(11) NULL DEFAULT NULL,
  `ImgShelf` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_shelf`) USING BTREE,
  INDEX `FK_shelf_id_wh_warehouse_id_wh`(`id_shelf`) USING BTREE,
  INDEX `FK_shelf_id_wh_sw_warehouse_id_wh`(`id_wh`) USING BTREE,
  CONSTRAINT `FK_shelf_id_wh_sw_warehouse_id_wh` FOREIGN KEY (`id_wh`) REFERENCES `warehouse` (`id_wh`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of shelf
-- ----------------------------
INSERT INTO `shelf` VALUES (1, 'Ngăn Tủ 1', 1, 73, 27, 'afc2d35e3672c4b430f8af7919a466c1');
INSERT INTO `shelf` VALUES (2, 'Ngăn Tủ 2', 1, 100, 1, '35eef6d665d32ec2e5b577cf9f06e029');
INSERT INTO `shelf` VALUES (3, 'Ngăn Tủ 3', 1, 100, 0, '8b66acf66414823e05f90cd1520765d3');
INSERT INTO `shelf` VALUES (4, 'Ngăn Tủ 4', 1, 100, 0, 'fd1f51f08ac9cf031bafada1d44ee1bd');
INSERT INTO `shelf` VALUES (5, 'Ngăn Tủ 5', 1, 100, 0, '89bd00ea94f46d7189124e1cfb0cfd40');

-- ----------------------------
-- Table structure for warehouse
-- ----------------------------
DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE `warehouse`  (
  `id_wh` int(11) NOT NULL AUTO_INCREMENT,
  `name_warehoue` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_wh`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of warehouse
-- ----------------------------
INSERT INTO `warehouse` VALUES (1, 'TU_01');

SET FOREIGN_KEY_CHECKS = 1;
