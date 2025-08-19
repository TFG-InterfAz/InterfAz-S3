from django.db import models
from django.contrib.auth.models import User  # or your custom User model
from django.utils.translation import gettext_lazy as _

class Generated_Html(models.Model):
    title = models.TextField(max_length=255)
    prompt = models.TextField(max_length=255)
    html_code = models.TextField(null=True, blank=True)
    
    # Add the many-to-many relationship with User
    users = models.ManyToManyField(
        User,
        through='UserRenderizerRelationship',
        related_name='renderizers'
    )
    
    # Optional: Add metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class AI_selector(models.TextChoices):
        STARCODER = "SC", _("StarCoder")
        OLLAMA = "OL", _("Ollama")
        OPENAI = "OP", _("OPENAI")
        GEMINI = "GE", _("Gemini")
        DEEPSEEK = "DK", _("DeepSeek")
        CURSOR = "CS", _("Cursor")
        CLAUDE = "CE", _("Claude")
        UNKNOWN = "UN", _("Unknown")

    ai = models.CharField(
        max_length=2,
        choices=AI_selector.choices,
        default=AI_selector.UNKNOWN,
    )

    def __str__(self):
        return self.title

class UserRenderizerRelationship(models.Model):
    """Intermediate model for User-Renderizer many-to-many relationship"""
    
    class PermissionChoices(models.TextChoices):
        OWNER = 'owner', _('Owner')
        COLLABORATOR = 'collaborator', _('Collaborator')  
        VIEWER = 'viewer', _('Viewer')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    renderizer = models.ForeignKey(Generated_Html, on_delete=models.CASCADE)
    permission = models.CharField(
        max_length=12,
        choices=PermissionChoices.choices,
        default=PermissionChoices.OWNER
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'renderizer']
        verbose_name = 'User Renderizer Relationship'
        verbose_name_plural = 'User Renderizer Relationships'
    
    def __str__(self):
        return f"{self.user.username} - {self.renderizer.title} ({self.permission})"