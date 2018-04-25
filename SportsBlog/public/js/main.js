$(document).ready(() => {
    $('.category-delete').on('click', (e) => {
        $target = $(e.target);
        $.ajax({
            type: 'DELETE',
            url: '/categories/delete/' + $target.attr('data-cat-id'),
            success: (response) => {
                alert("Category Removed");
            },
            error: (err) => {
                alert(err)
            }
        });
    });

    $('.article-delete').on('click', (e) => {
        $target = $(e.target);
        $.ajax({
            type: 'DELETE',
            url: '/articles/delete/' + $target.attr('data-artc-id'),
            success: (response) => {
                alert("Article Removed");
            },
            error: (err) => {
                alert(err)
            }
        });
    });
});