$(function() {  
    $('.logo-wrapper, .category-square, .btn-voltar').on('click', function() {
        window.document.location = $(this).data("href");
    });

    $(".users-posts-wrapper").on('click', '.category-chip', function() {
        window.document.location = $(this).data("href");
    });

    $(".followers-wrapper").on('click', '.follower-img', function() {
        window.document.location = $(this).data("href");
    });

    $('.events-content-wrapper').on('click', '.btn-save-changes', function() {
        $('.viewing-fields').removeClass('hidden');
        $('.editable-fields').addClass('hidden');
    });

    $('.events-content-wrapper').on('click', '.btn-edit-event', function() {
        $('.viewing-fields').addClass('hidden');
        $('.editable-fields').removeClass('hidden');
    });

    $(".btn-back").on('click', function() {
        parent.history.back();
        return false;
    });

    $(".users-posts-wrapper, .profile-option-content").on('click', '.svg-wrapper.reaction-svg', function() {
    	$(this).toggleClass('active');
    });

    $('input').focus(function() {
        var id = $(this).attr("id")
        , label = "." + id + "-label";

        $(this).addClass('input-selected');
        $(label).animate({
            top: "10px"
        }, 500);
        $(label).addClass('label-selected');
        if (id === 'foto') {
            $('input#foto').css('padding', '25px 2% 25px 2%');
        }
    });
});