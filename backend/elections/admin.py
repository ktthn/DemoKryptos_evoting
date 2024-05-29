from django.contrib import admin
from .models import Election, Candidate, Vote
from .paillier import generate_keypair


class ElectionAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "end_date", "created_by")

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            public_key, private_key = generate_keypair(512)
            obj.public_key_n = public_key.n.to_bytes(
                (public_key.n.bit_length() + 7) // 8, "big"
            )
            obj.private_key_p = private_key.p.to_bytes(
                (private_key.p.bit_length() + 7) // 8, "big"
            )
            obj.private_key_q = private_key.q.to_bytes(
                (private_key.q.bit_length() + 7) // 8, "big"
            )
        super().save_model(request, obj, form, change)


admin.site.register(Election, ElectionAdmin)
admin.site.register(Candidate)
admin.site.register(Vote)
