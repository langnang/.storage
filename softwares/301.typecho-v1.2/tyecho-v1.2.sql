-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- 主机： sql305.byetcluster.com
-- 生成日期： 2024-04-21 21:02:18
-- 服务器版本： 10.4.17-MariaDB
-- PHP 版本： 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `b32_28202196_typecho`
--

-- --------------------------------------------------------

--
-- 表的结构 `typecho_comments`
--

CREATE TABLE `typecho_comments` (
  `coid` int(10) UNSIGNED NOT NULL,
  `cid` int(10) UNSIGNED DEFAULT 0,
  `created` int(10) UNSIGNED DEFAULT 0,
  `author` varchar(200) DEFAULT NULL,
  `authorId` int(10) UNSIGNED DEFAULT 0,
  `ownerId` int(10) UNSIGNED DEFAULT 0,
  `mail` varchar(200) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `agent` varchar(200) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `type` varchar(16) DEFAULT 'comment',
  `status` varchar(16) DEFAULT 'approved',
  `parent` int(10) UNSIGNED DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `typecho_comments`
--

INSERT INTO `typecho_comments` (`coid`, `cid`, `created`, `author`, `authorId`, `ownerId`, `mail`, `url`, `ip`, `agent`, `text`, `type`, `status`, `parent`) VALUES
(1, 1, 1689648654, 'Typecho', 0, 1, NULL, 'http://typecho.org', '127.0.0.1', 'Typecho 1.1/17.10.30', '欢迎加入 Typecho 大家族', 'comment', 'approved', 0),
(2, 1, 1689748659, 'langnang', 1, 1, 'langnang.chen@outlook.com', 'http://www.typecho.org', '220.248.58.129', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0', '1', 'comment', 'approved', 1);

-- --------------------------------------------------------

--
-- 表的结构 `typecho_contents`
--

CREATE TABLE `typecho_contents` (
  `cid` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `created` int(10) UNSIGNED DEFAULT 0,
  `modified` int(10) UNSIGNED DEFAULT 0,
  `text` longtext DEFAULT NULL,
  `order` int(10) UNSIGNED DEFAULT 0,
  `authorId` int(10) UNSIGNED DEFAULT 0,
  `template` varchar(32) DEFAULT NULL,
  `type` varchar(16) DEFAULT 'post',
  `status` varchar(16) DEFAULT 'publish',
  `password` varchar(32) DEFAULT NULL,
  `commentsNum` int(10) UNSIGNED DEFAULT 0,
  `allowComment` char(1) DEFAULT '0',
  `allowPing` char(1) DEFAULT '0',
  `allowFeed` char(1) DEFAULT '0',
  `parent` int(10) UNSIGNED DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `typecho_contents`
--

INSERT INTO `typecho_contents` (`cid`, `title`, `slug`, `created`, `modified`, `text`, `order`, `authorId`, `template`, `type`, `status`, `password`, `commentsNum`, `allowComment`, `allowPing`, `allowFeed`, `parent`) VALUES
(1, '欢迎使用 Typecho', 'start', 1689648654, 1689648654, '<!--markdown-->如果您看到这篇文章,表示您的 blog 已经安装成功.', 0, 1, NULL, 'post', 'publish', NULL, 2, '1', '1', '1', 0),
(2, '关于', 'start-page', 1689648654, 1689648654, '<!--markdown-->本页面由 Typecho 创建, 这只是个测试页面.', '0', '1', NULL, 'page', 'publish', NULL, '0', '1', '1', '1', '0');

-- --------------------------------------------------------

--
-- 表的结构 `typecho_fields`
--

CREATE TABLE `typecho_fields` (
  `cid` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` varchar(8) DEFAULT 'str',
  `str_value` text DEFAULT NULL,
  `int_value` int(10) DEFAULT 0,
  `float_value` float DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `typecho_metas`
--

CREATE TABLE `typecho_metas` (
  `mid` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `type` varchar(32) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `count` int(10) UNSIGNED DEFAULT 0,
  `order` int(10) UNSIGNED DEFAULT 0,
  `parent` int(10) UNSIGNED DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `typecho_metas`
--

INSERT INTO `typecho_metas` (`mid`, `name`, `slug`, `type`, `description`, `count`, `order`, `parent`) VALUES
(1, '默认分类', 'default', 'category', '只是一个默认分类', 1, 1, 0);

-- --------------------------------------------------------

--
-- 表的结构 `typecho_options`
--

CREATE TABLE `typecho_options` (
  `name` varchar(32) NOT NULL,
  `user` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `value` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `typecho_options`
--

INSERT INTO `typecho_options` (`name`, `user`, `value`) VALUES
('theme', 0, 'default'),
('theme:default', 0, 'a:2:{s:7:\"logoUrl\";N;s:12:\"sidebarBlock\";a:5:{i:0;s:15:\"ShowRecentPosts\";i:1;s:18:\"ShowRecentComments\";i:2;s:12:\"ShowCategory\";i:3;s:11:\"ShowArchive\";i:4;s:9:\"ShowOther\";}}'),
('timezone', 0, '28800'),
('lang', 0, NULL),
('charset', 0, 'UTF-8'),
('contentType', 0, 'text/html'),
('gzip', 0, '0'),
('generator', 0, 'Typecho 1.2.1'),
('title', 0, 'Typecho'),
('description', 0, 'Just So So ...'),
('keywords', 0, 'typecho,php,blog'),
('rewrite', 0, '0'),
('frontPage', 0, 'recent'),
('frontArchive', 0, '0'),
('commentsRequireMail', 0, '1'),
('commentsWhitelist', 0, '0'),
('commentsRequireURL', 0, '0'),
('commentsRequireModeration', 0, '0'),
('plugins', 0, 'a:0:{}'),
('commentDateFormat', 0, 'F jS, Y \\a\\t h:i a'),
('siteUrl', 0, 'http://typecho-temp.22web.org'),
('defaultCategory', 0, '1'),
('allowRegister', 0, '0'),
('defaultAllowComment', 0, '1'),
('defaultAllowPing', 0, '1'),
('defaultAllowFeed', 0, '1'),
('pageSize', 0, '10'),
('postsListSize', 0, '10'),
('commentsListSize', 0, '10'),
('commentsHTMLTagAllowed', 0, NULL),
('postDateFormat', 0, 'Y-m-d'),
('feedFullText', 0, '0'),
('editorSize', 0, '350'),
('autoSave', 0, '0'),
('markdown', 0, '1'),
('xmlrpcMarkdown', 0, '0'),
('commentsMaxNestingLevels', 0, '5'),
('commentsPostTimeout', 0, '2592000'),
('commentsUrlNofollow', 0, '1'),
('commentsShowUrl', 0, '1'),
('commentsMarkdown', 0, '0'),
('commentsPageBreak', 0, '0'),
('commentsThreaded', 0, '1'),
('commentsPageSize', 0, '20'),
('commentsPageDisplay', 0, 'last'),
('commentsOrder', 0, 'ASC'),
('commentsCheckReferer', 0, '1'),
('commentsAutoClose', 0, '0'),
('commentsPostIntervalEnable', 0, '1'),
('commentsPostInterval', 0, '60'),
('commentsShowCommentOnly', 0, '0'),
('commentsAvatar', 0, '1'),
('commentsAvatarRating', 0, 'G'),
('commentsAntiSpam', 0, '1'),
('routingTable', 0, 'a:26:{i:0;a:25:{s:5:\"index\";a:6:{s:3:\"url\";s:1:\"/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:8:\"|^[/]?$|\";s:6:\"format\";s:1:\"/\";s:6:\"params\";a:0:{}}s:7:\"archive\";a:6:{s:3:\"url\";s:6:\"/blog/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:13:\"|^/blog[/]?$|\";s:6:\"format\";s:6:\"/blog/\";s:6:\"params\";a:0:{}}s:2:\"do\";a:6:{s:3:\"url\";s:22:\"/action/[action:alpha]\";s:6:\"widget\";s:9:\"Widget_Do\";s:6:\"action\";s:6:\"action\";s:4:\"regx\";s:32:\"|^/action/([_0-9a-zA-Z-]+)[/]?$|\";s:6:\"format\";s:10:\"/action/%s\";s:6:\"params\";a:1:{i:0;s:6:\"action\";}}s:4:\"post\";a:6:{s:3:\"url\";s:24:\"/archives/[cid:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:26:\"|^/archives/([0-9]+)[/]?$|\";s:6:\"format\";s:13:\"/archives/%s/\";s:6:\"params\";a:1:{i:0;s:3:\"cid\";}}s:10:\"attachment\";a:6:{s:3:\"url\";s:26:\"/attachment/[cid:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:28:\"|^/attachment/([0-9]+)[/]?$|\";s:6:\"format\";s:15:\"/attachment/%s/\";s:6:\"params\";a:1:{i:0;s:3:\"cid\";}}s:8:\"category\";a:6:{s:3:\"url\";s:17:\"/category/[slug]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:25:\"|^/category/([^/]+)[/]?$|\";s:6:\"format\";s:13:\"/category/%s/\";s:6:\"params\";a:1:{i:0;s:4:\"slug\";}}s:3:\"tag\";a:6:{s:3:\"url\";s:12:\"/tag/[slug]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:20:\"|^/tag/([^/]+)[/]?$|\";s:6:\"format\";s:8:\"/tag/%s/\";s:6:\"params\";a:1:{i:0;s:4:\"slug\";}}s:6:\"author\";a:6:{s:3:\"url\";s:22:\"/author/[uid:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:24:\"|^/author/([0-9]+)[/]?$|\";s:6:\"format\";s:11:\"/author/%s/\";s:6:\"params\";a:1:{i:0;s:3:\"uid\";}}s:6:\"search\";a:6:{s:3:\"url\";s:19:\"/search/[keywords]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:23:\"|^/search/([^/]+)[/]?$|\";s:6:\"format\";s:11:\"/search/%s/\";s:6:\"params\";a:1:{i:0;s:8:\"keywords\";}}s:10:\"index_page\";a:6:{s:3:\"url\";s:21:\"/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:22:\"|^/page/([0-9]+)[/]?$|\";s:6:\"format\";s:9:\"/page/%s/\";s:6:\"params\";a:1:{i:0;s:4:\"page\";}}s:12:\"archive_page\";a:6:{s:3:\"url\";s:26:\"/blog/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:27:\"|^/blog/page/([0-9]+)[/]?$|\";s:6:\"format\";s:14:\"/blog/page/%s/\";s:6:\"params\";a:1:{i:0;s:4:\"page\";}}s:13:\"category_page\";a:6:{s:3:\"url\";s:32:\"/category/[slug]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:34:\"|^/category/([^/]+)/([0-9]+)[/]?$|\";s:6:\"format\";s:16:\"/category/%s/%s/\";s:6:\"params\";a:2:{i:0;s:4:\"slug\";i:1;s:4:\"page\";}}s:8:\"tag_page\";a:6:{s:3:\"url\";s:27:\"/tag/[slug]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:29:\"|^/tag/([^/]+)/([0-9]+)[/]?$|\";s:6:\"format\";s:11:\"/tag/%s/%s/\";s:6:\"params\";a:2:{i:0;s:4:\"slug\";i:1;s:4:\"page\";}}s:11:\"author_page\";a:6:{s:3:\"url\";s:37:\"/author/[uid:digital]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:33:\"|^/author/([0-9]+)/([0-9]+)[/]?$|\";s:6:\"format\";s:14:\"/author/%s/%s/\";s:6:\"params\";a:2:{i:0;s:3:\"uid\";i:1;s:4:\"page\";}}s:11:\"search_page\";a:6:{s:3:\"url\";s:34:\"/search/[keywords]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:32:\"|^/search/([^/]+)/([0-9]+)[/]?$|\";s:6:\"format\";s:14:\"/search/%s/%s/\";s:6:\"params\";a:2:{i:0;s:8:\"keywords\";i:1;s:4:\"page\";}}s:12:\"archive_year\";a:6:{s:3:\"url\";s:18:\"/[year:digital:4]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:19:\"|^/([0-9]{4})[/]?$|\";s:6:\"format\";s:4:\"/%s/\";s:6:\"params\";a:1:{i:0;s:4:\"year\";}}s:13:\"archive_month\";a:6:{s:3:\"url\";s:36:\"/[year:digital:4]/[month:digital:2]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:30:\"|^/([0-9]{4})/([0-9]{2})[/]?$|\";s:6:\"format\";s:7:\"/%s/%s/\";s:6:\"params\";a:2:{i:0;s:4:\"year\";i:1;s:5:\"month\";}}s:11:\"archive_day\";a:6:{s:3:\"url\";s:52:\"/[year:digital:4]/[month:digital:2]/[day:digital:2]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:41:\"|^/([0-9]{4})/([0-9]{2})/([0-9]{2})[/]?$|\";s:6:\"format\";s:10:\"/%s/%s/%s/\";s:6:\"params\";a:3:{i:0;s:4:\"year\";i:1;s:5:\"month\";i:2;s:3:\"day\";}}s:17:\"archive_year_page\";a:6:{s:3:\"url\";s:38:\"/[year:digital:4]/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:33:\"|^/([0-9]{4})/page/([0-9]+)[/]?$|\";s:6:\"format\";s:12:\"/%s/page/%s/\";s:6:\"params\";a:2:{i:0;s:4:\"year\";i:1;s:4:\"page\";}}s:18:\"archive_month_page\";a:6:{s:3:\"url\";s:56:\"/[year:digital:4]/[month:digital:2]/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:44:\"|^/([0-9]{4})/([0-9]{2})/page/([0-9]+)[/]?$|\";s:6:\"format\";s:15:\"/%s/%s/page/%s/\";s:6:\"params\";a:3:{i:0;s:4:\"year\";i:1;s:5:\"month\";i:2;s:4:\"page\";}}s:16:\"archive_day_page\";a:6:{s:3:\"url\";s:72:\"/[year:digital:4]/[month:digital:2]/[day:digital:2]/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:55:\"|^/([0-9]{4})/([0-9]{2})/([0-9]{2})/page/([0-9]+)[/]?$|\";s:6:\"format\";s:18:\"/%s/%s/%s/page/%s/\";s:6:\"params\";a:4:{i:0;s:4:\"year\";i:1;s:5:\"month\";i:2;s:3:\"day\";i:3;s:4:\"page\";}}s:12:\"comment_page\";a:6:{s:3:\"url\";s:53:\"[permalink:string]/comment-page-[commentPage:digital]\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:36:\"|^(.+)/comment\\-page\\-([0-9]+)[/]?$|\";s:6:\"format\";s:18:\"%s/comment-page-%s\";s:6:\"params\";a:2:{i:0;s:9:\"permalink\";i:1;s:11:\"commentPage\";}}s:4:\"feed\";a:6:{s:3:\"url\";s:20:\"/feed[feed:string:0]\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:4:\"feed\";s:4:\"regx\";s:17:\"|^/feed(.*)[/]?$|\";s:6:\"format\";s:7:\"/feed%s\";s:6:\"params\";a:1:{i:0;s:4:\"feed\";}}s:8:\"feedback\";a:6:{s:3:\"url\";s:31:\"[permalink:string]/[type:alpha]\";s:6:\"widget\";s:15:\"Widget_Feedback\";s:6:\"action\";s:6:\"action\";s:4:\"regx\";s:29:\"|^(.+)/([_0-9a-zA-Z-]+)[/]?$|\";s:6:\"format\";s:5:\"%s/%s\";s:6:\"params\";a:2:{i:0;s:9:\"permalink\";i:1;s:4:\"type\";}}s:4:\"page\";a:6:{s:3:\"url\";s:12:\"/[slug].html\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";s:4:\"regx\";s:22:\"|^/([^/]+)\\.html[/]?$|\";s:6:\"format\";s:8:\"/%s.html\";s:6:\"params\";a:1:{i:0;s:4:\"slug\";}}}s:5:\"index\";a:3:{s:3:\"url\";s:1:\"/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:7:\"archive\";a:3:{s:3:\"url\";s:6:\"/blog/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:2:\"do\";a:3:{s:3:\"url\";s:22:\"/action/[action:alpha]\";s:6:\"widget\";s:9:\"Widget_Do\";s:6:\"action\";s:6:\"action\";}s:4:\"post\";a:3:{s:3:\"url\";s:24:\"/archives/[cid:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:10:\"attachment\";a:3:{s:3:\"url\";s:26:\"/attachment/[cid:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:8:\"category\";a:3:{s:3:\"url\";s:17:\"/category/[slug]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:3:\"tag\";a:3:{s:3:\"url\";s:12:\"/tag/[slug]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:6:\"author\";a:3:{s:3:\"url\";s:22:\"/author/[uid:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:6:\"search\";a:3:{s:3:\"url\";s:19:\"/search/[keywords]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:10:\"index_page\";a:3:{s:3:\"url\";s:21:\"/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:12:\"archive_page\";a:3:{s:3:\"url\";s:26:\"/blog/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:13:\"category_page\";a:3:{s:3:\"url\";s:32:\"/category/[slug]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:8:\"tag_page\";a:3:{s:3:\"url\";s:27:\"/tag/[slug]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:11:\"author_page\";a:3:{s:3:\"url\";s:37:\"/author/[uid:digital]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:11:\"search_page\";a:3:{s:3:\"url\";s:34:\"/search/[keywords]/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:12:\"archive_year\";a:3:{s:3:\"url\";s:18:\"/[year:digital:4]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:13:\"archive_month\";a:3:{s:3:\"url\";s:36:\"/[year:digital:4]/[month:digital:2]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:11:\"archive_day\";a:3:{s:3:\"url\";s:52:\"/[year:digital:4]/[month:digital:2]/[day:digital:2]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:17:\"archive_year_page\";a:3:{s:3:\"url\";s:38:\"/[year:digital:4]/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:18:\"archive_month_page\";a:3:{s:3:\"url\";s:56:\"/[year:digital:4]/[month:digital:2]/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:16:\"archive_day_page\";a:3:{s:3:\"url\";s:72:\"/[year:digital:4]/[month:digital:2]/[day:digital:2]/page/[page:digital]/\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:12:\"comment_page\";a:3:{s:3:\"url\";s:53:\"[permalink:string]/comment-page-[commentPage:digital]\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}s:4:\"feed\";a:3:{s:3:\"url\";s:20:\"/feed[feed:string:0]\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:4:\"feed\";}s:8:\"feedback\";a:3:{s:3:\"url\";s:31:\"[permalink:string]/[type:alpha]\";s:6:\"widget\";s:15:\"Widget_Feedback\";s:6:\"action\";s:6:\"action\";}s:4:\"page\";a:3:{s:3:\"url\";s:12:\"/[slug].html\";s:6:\"widget\";s:14:\"Widget_Archive\";s:6:\"action\";s:6:\"render\";}}'),
('actionTable', 0, 'a:0:{}'),
('panelTable', 0, 'a:0:{}'),
('attachmentTypes', 0, '@image@'),
('secret', 0, '*LAri&zGRMMbrbX89sDNOCYLehnS&jH2'),
('installed', 0, '1'),
('allowXmlRpc', 0, '2'),
('autoSave', 1, '1'),
('markdown', 1, '1'),
('xmlrpcMarkdown', 1, '0'),
('defaultAllowComment', 1, '1'),
('defaultAllowPing', 1, '1'),
('defaultAllowFeed', 1, '1');

-- --------------------------------------------------------

--
-- 表的结构 `typecho_relationships`
--

CREATE TABLE `typecho_relationships` (
  `cid` int(10) UNSIGNED NOT NULL,
  `mid` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `typecho_relationships`
--

INSERT INTO `typecho_relationships` (`cid`, `mid`) VALUES
(1, 1),
(6, 5);

-- --------------------------------------------------------

--
-- 表的结构 `typecho_users`
--

CREATE TABLE `typecho_users` (
  `uid` int(10) UNSIGNED NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `mail` varchar(200) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `screenName` varchar(32) DEFAULT NULL,
  `created` int(10) UNSIGNED DEFAULT 0,
  `activated` int(10) UNSIGNED DEFAULT 0,
  `logged` int(10) UNSIGNED DEFAULT 0,
  `group` varchar(16) DEFAULT 'visitor',
  `authCode` varchar(64) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `typecho_users`
--

INSERT INTO `typecho_users` (`uid`, `name`, `password`, `mail`, `url`, `screenName`, `created`, `activated`, `logged`, `group`, `authCode`) VALUES
(1, 'langnang', '$P$BQ0RTmqRc5uAti3DvTpUpm4x/F3pQL1', 'langnang.chen@outlook.com', 'http://www.typecho.org', 'langnang', 1689648654, 1713520331, 1713417510, 'administrator', '960e4465b23545e224a1e28684641597');

--
-- 转储表的索引
--

--
-- 表的索引 `typecho_comments`
--
ALTER TABLE `typecho_comments`
  ADD PRIMARY KEY (`coid`),
  ADD KEY `cid` (`cid`),
  ADD KEY `created` (`created`);

--
-- 表的索引 `typecho_contents`
--
ALTER TABLE `typecho_contents`
  ADD PRIMARY KEY (`cid`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `created` (`created`);

--
-- 表的索引 `typecho_fields`
--
ALTER TABLE `typecho_fields`
  ADD PRIMARY KEY (`cid`,`name`),
  ADD KEY `int_value` (`int_value`),
  ADD KEY `float_value` (`float_value`);

--
-- 表的索引 `typecho_metas`
--
ALTER TABLE `typecho_metas`
  ADD PRIMARY KEY (`mid`),
  ADD KEY `slug` (`slug`);

--
-- 表的索引 `typecho_options`
--
ALTER TABLE `typecho_options`
  ADD PRIMARY KEY (`name`,`user`);

--
-- 表的索引 `typecho_relationships`
--
ALTER TABLE `typecho_relationships`
  ADD PRIMARY KEY (`cid`,`mid`);

--
-- 表的索引 `typecho_users`
--
ALTER TABLE `typecho_users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `typecho_comments`
--
ALTER TABLE `typecho_comments`
  MODIFY `coid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `typecho_contents`
--
ALTER TABLE `typecho_contents`
  MODIFY `cid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- 使用表AUTO_INCREMENT `typecho_metas`
--
ALTER TABLE `typecho_metas`
  MODIFY `mid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- 使用表AUTO_INCREMENT `typecho_users`
--
ALTER TABLE `typecho_users`
  MODIFY `uid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--
-- Byethost 数据迁移
--

INSERT INTO `b32_28202196_typecho`.`typecho_contents` (`title`,`slug`,`created`,`modified`,`text`,`authorId`)

SELECT `title`,`slug`,`created`,`modified`,`text`, 1 AS `authorId` FROM `b32_28202196_langnang`.`article_contents`;

--

INSERT INTO `b32_28202196_typecho`.`typecho_relationships`

SELECT `cid`,65 AS `mid` FROM `b32_28202196_typecho`.`typecho_contents` WHERE `cid`>= 300;

-- novel

INSERT INTO `b32_28202196_typecho`.`typecho_contents` (`title`,`slug`,`text`,`authorId`)


SELECT `title`,`slug`,CONCAT('<!--markdown-->

',`description`,'

<!--more-->

```yaml
href: ',`slug`,'
ico: ',`ico`,'
```')  AS `text`, 1 AS `authorId` FROM `b32_28202196_langnang`.`novel_contents`

-- 

INSERT INTO `b32_28202196_typecho`.`typecho_relationships`

SELECT `cid`,68 AS `mid` FROM `b32_28202196_typecho`.`typecho_contents` WHERE `cid`>= 571;


INSERT INTO `b32_28202196_typecho`.`typecho_contents` (`title`,`slug`,`text`,`authorId`)

-- question

SELECT `title`,`slug`,CONCAT('<!--markdown-->

','

<!--more-->

```yaml
type: ',`type`,'
```

',`text`)  AS `text`, 1 AS `authorId` FROM `b32_28202196_langnang`.`question_contents`

-- 
INSERT INTO `b32_28202196_typecho`.`typecho_relationships`

SELECT `cid`,18 AS `mid` FROM `b32_28202196_typecho`.`typecho_contents` WHERE `cid`>= 1082

-- video

INSERT INTO `b32_28202196_typecho`.`typecho_contents` (`title`,`slug`,`text`,`authorId`)


SELECT `title`,`slug`,CONCAT('<!--markdown-->

','

<!--more-->

```yaml
href: ',`slug`,'
ico: ',`ico`,'
```')  AS `text`, 1 AS `authorId` FROM `b32_28202196_langnang`.`video_contents`

-- 
INSERT INTO `b32_28202196_typecho`.`typecho_relationships`

SELECT `cid`,24 AS `mid` FROM `b32_28202196_typecho`.`typecho_contents` WHERE `cid`>= 2105
