$(document).ready(() => {
    $('.delete').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr("data-id");
        $.ajax({
            type: 'DELETE',
            url: '/todo/delete/'+id,
            success: (response) => {
                alert("Deleting A task ... ");
                window.location.href = '/todo';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
})