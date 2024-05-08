<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<?php $this->need('header.php'); ?>
<div id="main">
<?php if (!empty($this->options->Breadcrumbs) && in_array('Postshow', $this->options->Breadcrumbs)): ?>
<div class="mdui-card" style="margin-top:20px;background-color: rgba(180, 180, 180, 0.25);">
    <span class="mdui-chip-icon" style="border-radius:2px;"><i class="mdui-icon material-icons">chevron_right</i></span>
    <span class="mdui-chip-title">
        <a href="<?php $this->options->siteUrl(); ?>">首页</a> &raquo; <?php $this->category(); ?> &raquo; <?php if (!empty($this->options->Breadcrumbs) && in_array('Text', $this->options->Breadcrumbs)): ?>正文<?php else: $this->title(); endif; ?>
    </span>
</div>
<?php endif; ?>
<div id="post" class="mdui-card <?php if ($this->options->PjaxOption && $this->hidden): ?> protected<?php endif; ?>" style="margin-top:20px;">
    <?php if ($this->options->mdrPostThumb): ?>
    <div class="mdui-card-media">
        <?php echo postThumb($this); ?>
    </div>
    <?php endif; ?>
    <div class="mdui-card-primary">
        <div class="mdui-card-primary-title"><?php $this->title() ?></div>
        <div class="mdui-card-primary-subtitle">
              <?php $this->date(); ?>
            | <?php $this->category(','); ?>
            | <?php $this->commentsNum('暂无评论', '%d 条评论'); ?>
            | <?php Postviews($this); ?>
            <?php if ($this->options->WordCount): ?>
            | <?php WordCount($this->cid); ?>
            <?php endif; ?>
        </div>
    </div>
    <div class="mdui-card-content mdui-typo" style="padding: 0px 16px 16px 16px;">
<?php if ($this->options->TimeNotice): ?>
<?php 
$time=time() - $this->modified;
$lock=$this->options->TimeNoticeLock;
$lock=$lock*24*60*60;
if ($time>=$lock) {
?>
<script defer>
<?php if ($_GET['_pjax']) { ?>
mdui.snackbar({message: '此文章最后修订于 <?php echo date('Y年m月d日' , $this->modified);?>，其中的信息可能已经有所发展或是发生改变。',position: '<?=$this->options->mdrSnackbar?>',timeout:5000});
<?php } else { ?>
window.onload=function (){
    mdui.snackbar({message: '此文章最后修订于 <?php echo date('Y年m月d日' , $this->modified);?>，其中的信息可能已经有所发展或是发生改变。',position: '<?=$this->options->mdrSnackbar?>',timeout:5000});
}
<?php } ?>
</script>
<?php } ?>
<?php endif; ?>
<?php $this->content(); ?>
<?php license($this->fields->linceses); ?>
</div>
</div>
<div class="tags"><?php mdrTags($this); ?></div>
<?php $this->need('comments.php'); ?>
<div class="mdui-row" style="margin-top: 32px;margin-bottom: 16px;">
<div class="mdui-ripple mdui-col-xs-6 mdui-col-sm-6" style="text-align: left;">
<div style="display: inline-block;box-sizing: border-box;width: 100%;height: 100%;font-weight: 500;font-size: 20px;line-height: 24px;-webkit-font-smoothing: antialiased;">
<i class="mdui-icon material-icons" style="float: left;margin-right: 10px;padding-top: 24px;width: 24px;">arrow_back</i>
<span style="margin-bottom: 1px;font-size: 15px;line-height: 18px;opacity: .75;">上一篇</span>
<div style="overflow: hidden;margin-left: 34px;height: 24px;text-overflow: ellipsis;white-space: nowrap;"><?php $this->thePrev('%s','没有了'); ?></div>
</div>
</div>
<div class="mdui-ripple mdui-col-xs-6 mdui-col-sm-6" style="text-align: right;">
<div style="display: inline-block;box-sizing: border-box;width: 100%;height: 100%;font-weight: 500;font-size: 20px;line-height: 24px;-webkit-font-smoothing: antialiased;">
<i class="mdui-icon material-icons" style="float: right;margin-left: 10px;padding-top: 24px;width: 24px;">arrow_forward</i>
<span style="margin-bottom: 1px;font-size: 15px;line-height: 18px;opacity: .75;">下一篇</span>
<div style="overflow: hidden;margin-left: 34px;height: 24px;text-overflow: ellipsis;white-space: nowrap;"><?php $this->theNext('%s','没有了'); ?></div>
</div>
</div>
</div>
</div>
<?php $this->need('footer.php'); ?>