<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const success = ref();
    const message = ref();
    const error = ref();
    const router = useRouter();

    onMounted(async () => {
        const response = await fetch('http://localhost:3000/message/retrieve', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicId: router.currentRoute.value.query.publicId,
                key: router.currentRoute.value.query.key
            }),
        });
        const body = await response.json() as {
            success: boolean
            message?: string
            error?: string
        }
        success.value = body.success;
        if (success.value) {
            message.value = body.message;
        } else {
            error.value = body.error;
        }
    })
</script>

<template>
    <div v-if="message">{{message}}</div>
    <div v-else-if="error">Failed to retrieve the message: {{error}}</div>
    <div v-else>Retrieving your message...</div>
</template>