<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title>Self Order</title>
    <meta name="description" content="Self Order">

    <link href="<?php echo e(mix('css/app.css')); ?>" rel="stylesheet">

    <meta name="theme-color" content="#CD1B6F"/>
</head>
<body>
    <div class="app-loader">
        <img src="/images/loader.gif" />
    </div>

    <div id="app" v-cloak>
    </div>

    <?php echo $__env->make("partials.noscript", \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

   <!-- <script>
            window.Laravel = <?php echo json_encode([
                'vapidPublicKey' => config('webpush.vapid.public_key'),
            ]); ?>;
    </script> -->

    <script>
        document.querySelector("body").classList.add("is-loading");
    </script>

    <script src="<?php echo e(mix('js/manifest.js')); ?>"></script>
    <script src="<?php echo e(mix('js/vendor.js')); ?>"></script>
    <script src="<?php echo e(mix('js/app.js')); ?>"></script>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\self-order\resources\views/layouts/app.blade.php ENDPATH**/ ?>