<script>
    angularScope(['$location', 'Session', function ($location, Session) {
        <?php if (isset($message)): ?>
        Session.setMessage('<?php echo $message; ?>', 'danger');
        <?php endif; ?>

        $location.path('<?php echo $url; ?>');
    }]);
</script>
