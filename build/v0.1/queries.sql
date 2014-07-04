create database `notes`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(8) unsigned NOT NULL auto_increment,
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  `password_hash` varchar(255) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `status` int(1) default 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `resetMd5` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `subject` (
  `id` int(8) unsigned NOT NULL auto_increment,
  `name` varchar(255) default NULL,
  `user_ref` int(8) unsigned default NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `note` (
  `id` int(8) unsigned NOT NULL auto_increment,
  `text` TEXT default NULL,
  `parent_type` varchar(255) default NULL,
  `parent_id` int(8) unsigned NOT NULL,
  `img_ref` int(8) unsigned default NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `topic` (
  `id` int(8) unsigned NOT NULL auto_increment,
  `text` TEXT default NULL,
  `subject_ref` int(8) unsigned NOT NULL,
  `img_ref` int(8) unsigned default NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `subtopic` (
  `id` int(8) unsigned NOT NULL auto_increment,
  `text` TEXT default NULL,
  `topic_ref` int(8) unsigned NOT NULL,
  `img_ref` int(8) unsigned default NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `image_refs` (
  `id` int(8) unsigned NOT NULL auto_increment,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1;

ALTER TABLE `notes`.`subject` ADD INDEX `user_ref` (`user_ref`);
ALTER TABLE `notes`.`topic` ADD INDEX `subject_ref` (`subject_ref`);
ALTER TABLE `notes`.`subtopic` ADD INDEX `topic_ref` (`topic_ref`);
ALTER TABLE `notes`.`note` ADD INDEX `parent_id` (`parent_id`);

ALTER TABLE `notes`.`topic` ADD INDEX `img_ref` (`img_ref`);
ALTER TABLE `notes`.`subtopic` ADD INDEX `img_ref` (`img_ref`);
ALTER TABLE `notes`.`note` ADD INDEX `img_ref` (`img_ref`);

ALTER TABLE  `subject` ADD FOREIGN KEY (  `user_ref` ) REFERENCES  `notes`.`users` (`id`) 
ON DELETE SET NULL ON UPDATE CASCADE ;

ALTER TABLE  `topic` ADD FOREIGN KEY (  `img_ref` ) REFERENCES  `notes`.`image_refs` (`id`) 
ON DELETE SET NULL ON UPDATE CASCADE ;
ALTER TABLE  `subtopic` ADD FOREIGN KEY (  `img_ref` ) REFERENCES  `notes`.`image_refs` (`id`) 
ON DELETE SET NULL ON UPDATE CASCADE ;
ALTER TABLE  `note` ADD FOREIGN KEY (  `img_ref` ) REFERENCES  `notes`.`image_refs` (`id`) 
ON DELETE SET NULL ON UPDATE CASCADE ;

ALTER TABLE  `topic` ADD FOREIGN KEY (  `subject_ref` ) REFERENCES  `notes`.`subject` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE ;
ALTER TABLE  `subtopic` ADD FOREIGN KEY (  `topic_ref` ) REFERENCES  `notes`.`topic` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE ;

delete from notes;
delete from subtopics;
delete from topics;
delete from image_refs;
