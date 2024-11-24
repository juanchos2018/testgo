<!-- nav -->
<nav class="nav-primary hidden-xs">
  <!--div class="text-muted text-sm hidden-nav-xs padder m-t-sm m-b-sm">Planificación</div-->
  <ul class="nav nav-main" data-ride="collapse">
  <?php foreach ($this->menu as $menu): ?>
    <li>
      <a href="<?php echo (isset($menu['url']) ? $menu['url'] : '#'); ?>" name="<?php echo $menu['name']; ?>" class="auto" <?php echo (isset($menu['attrs']) ? $menu['attrs'] : ''); ?> >
      <?php if (isset($menu['items'])): ?>
        <span class="pull-right text-muted">
          <i class="i i-circle-sm-o text"></i>
          <i class="i i-circle-sm text-active"></i>
        </span>
      <?php endif; ?>
      <?php if (isset($menu['icon'])): ?>
        <i class="<?php echo $menu['icon']; ?>"></i>
      <?php endif; ?>
        <span class="font-bold"><?php echo $menu['text']; ?></span>
      </a>

    <?php if (isset($menu['items'])): ?>
      <ul class="nav dk">
      <?php foreach ($menu['items'] as $submenu): ?>
        <li>
          <a href="<?php echo (isset($submenu['url']) ? $submenu['url'] : '#'); ?>" class="auto" name="<?php echo $submenu['name']; ?>" <?php echo (isset($submenu['attrs']) ? $submenu['attrs'] : ''); ?> >
          <?php if (isset($submenu['items'])): ?>
            <i class="fa fa-circle-o"></i>
          <?php else: ?>
            <i class="i i-dot"></i>
          <?php endif; ?>
            <span><?php echo $submenu['text']; ?></span>
          </a>

        <?php if (isset($submenu['items'])): ?>
          <ul class="nav dker">
          <?php foreach ($submenu['items'] as $item): ?>
            <li>
              <a href="<?php echo (isset($item['url']) ? $item['url'] : '#'); ?>" name="<?php echo $item['name']; ?>" <?php echo (isset($item['attrs']) ? $item['attrs'] : ''); ?> >
                <i class="i i-dot"></i><span><?php echo $item['text']; ?></span>
              </a>
            </li>
          <?php endforeach; ?>
          </ul>
        <?php endif; ?>
        </li>
      <?php endforeach; ?>
      </ul>
    <?php endif; ?>
    </li>
  <?php endforeach; ?>

  </ul>
</nav>
<!-- / nav -->