import type {AnyFieldApi} from "@tanstack/react-form";

export function FieldInfo({field}: { field: AnyFieldApi }) {
    const errors = field.state.meta.errors as { message: string }[]

    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <p className="text-sm text-red-500">
                    {errors.map(err => err.message).join(", ")}
                </p>
            ) : null}
        </>
    )
}
