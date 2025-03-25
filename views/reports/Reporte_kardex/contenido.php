<table class="tabla2">
    <thead>
        <tr>
            <?php 
            // Excluir campos específicos
            $excluir = ['id_producto', 'create_at','unidad_medida']; 
            foreach (array_keys($resultado[0]) as $key): 
                if (!in_array($key, $excluir)): ?>
                    <th class="text-center"><?= ucfirst(str_replace('_', ' ', $key)) ?></th>
                <?php endif; 
            endforeach; ?>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($resultado as $fila): ?>
            <tr>
                <?php foreach ($fila as $key => $valor): 
                    if (!in_array($key, $excluir)): ?>
                        <td class="text-center"><?= htmlspecialchars($valor ?? 'N/A') ?></td>
                    <?php endif; 
                endforeach; ?>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
